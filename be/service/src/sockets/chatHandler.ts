import type { WebSocket } from "ws";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import { TripInfoBase } from "../models/trip";
import TripService from "../services/trip.service";
import { bookBusTicketsDB } from "../config/db";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const tripService = new TripService(bookBusTicketsDB);

const handleChatMessage = async (ws: WebSocket, message: string) => {
  try {
    console.log("Received message:", message);

    const userMessage = JSON.parse(message).text || message;
    const intentPrompt = `
Bạn là trợ lý hỗ trợ đặt vé xe.

Nếu câu hỏi người dùng liên quan đến tìm chuyến đi xe (điểm đi, điểm đến, thời gian, biển số xe),
trả về "yes". Nếu không, trả về "no".

Câu hỏi: "${userMessage}"
`;

    const intentResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: intentPrompt }],
    });

    const intentAnswer = (intentResponse.choices[0].message?.content || "").trim().toLowerCase();

    if (intentAnswer !== "yes") {
      ws.send(
        JSON.stringify({
          type: "chat",
          message:
            "Chào bạn, tôi chỉ có thể giúp tìm kiếm chuyến xe với điểm đi , điểm đến , biển số xe , và thời gian khởi hành thôi nha bạn. Xin lỗi bạn vì sự bất tiện này",
        })
      );
      return;
    }

    // Gọi GPT để trích xuất điểm đi, điểm đến, biển số xe, thời gian đi
    const extractionPrompt = `
Bạn là trợ lý hỗ trợ đặt vé xe. Hãy trích xuất điểm đi (from), điểm đến (to), biển số xe (licensePlate), và thời gian (time) trong đoạn văn sau. Trả về đúng định dạng JSON gồm 3 trường: from, to, time.

- Trường time phải ở định dạng **"yyyy-MM-dd HH:mm:ss"** (24h, chuẩn MySQL DATETIME).
- Nếu người dùng không nói rõ giờ, mặc định là "00:00:00".
- Nếu không nói rõ năm, giả định là năm hiện tại.
- Nếu không xác định được thông tin, trả về chuỗi rỗng cho trường đó.
- Trả về đúng định dạng JSON, không thêm mô tả hoặc ký tự đặc biệt.


Văn bản: "${userMessage}"
`;

    const extractionResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: extractionPrompt }],
    });

    const extractionContent = extractionResponse.choices[0].message?.content || "";
    console.log("Extraction result:", extractionContent);

    let extracted = { from: "", to: "", time: "", licensePlate: "" };

    try {
      // Loại bỏ ```json và ``` nếu có, rồi parse JSON
      const cleaned = extractionContent
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      extracted = JSON.parse(cleaned);
    } catch (e) {
      console.warn("Không parse được JSON từ GPT, dùng mặc định.");
    }

    console.log("Extracted data:", extracted);

    // Nếu thiếu dữ liệu, có thể trả lỗi hoặc xử lý mặc định
    if (!extracted.from || !extracted.to || !extracted.time) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Không nhận diện được điểm đi, điểm đến hoặc thời gian.",
        })
      );
      return;
    }

    const tripsResult = await tripService.getAllFiltered(10, 0, "ASC", {
      licensePlate: extracted.licensePlate || "",
      departure: extracted.from,
      arrival: extracted.to,
      startTime: extracted.time,
    });
    const dataTrips = tripsResult.data;
    console.log("dataTrip", dataTrips);

    if (!dataTrips || dataTrips.length <= 0) {
      ws.send(JSON.stringify({ type: "error", message: "Không tìm thấy chuyến đi phù hợp." }));
      return;
    }

    const tripsInfo = dataTrips.map((trip: TripInfoBase) => ({
      id: trip.id,
      tripName: trip.tripName,
      licensePlate: trip.licensePlate,
      driverName: trip.driverName,
      startTime: trip.startTime,
      endTime: trip.endTime,
      price: trip.price,
      totalSeatAvailable: trip.totalSeatAvailable,
    }));

    ws.send(
      JSON.stringify({
        type: "chat",
        message: `Dưới đây là các chuyến đi phù hợp:`,
        trips: tripsInfo,
      })
    );
  } catch (error) {
    console.error("Socket error:", error);
    ws.send(JSON.stringify({ type: "error", message: "Đã xảy ra lỗi xử lý." }));
  }
};

export default handleChatMessage;
