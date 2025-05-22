import type { WebSocket } from "ws";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import { TripInfoBase } from "../models/trip";
import TripService from "../services/trip.service";
import { bookBusTicketsDB } from "../config/db";
import { getEndOfMonthOfString } from "../utils/getLastDateOfMonth";
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
            "Chào bạn, tôi chỉ có thể giúp tìm kiếm chuyến xe với điểm đi, điểm đến, biển số xe, và thời gian khởi hành thôi nha bạn. Xin lỗi bạn vì sự bất tiện này",
        })
      );
      return;
    }

    const extractionPrompt = `
Bạn là trợ lý hỗ trợ đặt vé xe. Hãy trích xuất từ đoạn văn sau các thông tin:

- điểm đi (from),
- điểm đến (to),
- biển số xe (licensePlate),
- thời gian khởi hành (time),
- ý định sắp xếp theo giá (priceSort),
- ý định sắp xếp theo thời gian (timeSort).

Yêu cầu:
- Trường time phải ở định dạng "yyyy-MM-dd HH:mm:ss" (24h, chuẩn MySQL DATETIME).
- Nếu người dùng không nói rõ giờ, mặc định "00:00:00".
- Nếu không nói rõ năm, giả định năm hiện tại.
- Trường priceSort và timeSort có thể là "ASC" (tăng dần), "DESC" (giảm dần), hoặc "" (không sắp xếp).
- Nếu không xác định được thông tin nào, trả về chuỗi rỗng cho trường đó.
- Trả về đúng định dạng JSON, không thêm mô tả hay ký tự đặc biệt.

Văn bản: "${userMessage}"
`;

    const extractionResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: extractionPrompt }],
    });

    const extractionContent = extractionResponse.choices[0].message?.content || "";
    console.log("Extraction result:", extractionContent);

    let extracted = {
      from: "",
      to: "",
      time: "",
      licensePlate: "",
      priceSort: "",
      timeSort: "",
      endTime: "",
    };

    try {
      const cleaned = extractionContent
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      extracted = JSON.parse(cleaned);
    } catch (e) {
      console.warn("Không parse được JSON từ GPT, dùng mặc định.");
    }

    console.log("Extracted data:", extracted);

    if (!extracted.from || !extracted.to || !extracted.time) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Không nhận diện được điểm đi, điểm đến hoặc thời gian.",
        })
      );
      return;
    }

    // --- Xử lý thời gian ---
    let startTime = extracted.time;
    let endTime = extracted.time;

    if (extracted.time) {
      const parsed = new Date(extracted.time);
      const today = new Date();

      const isOnlyMonthSpecified =
        parsed.getDate() === 1 &&
        parsed.getHours() === 0 &&
        parsed.getMinutes() === 0 &&
        parsed.getSeconds() === 0;

      const isSameMonthAndYear =
        parsed.getMonth() === today.getMonth() && parsed.getFullYear() === today.getFullYear();

      if (isOnlyMonthSpecified && isSameMonthAndYear) {
        startTime = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(today.getDate()).padStart(2, "0")} 00:00:00`;
        endTime = getEndOfMonthOfString(today);
      }
    }

    const priceSort =
      extracted.priceSort === "ASC" || extracted.priceSort === "DESC" ? extracted.priceSort : null;
    const timeSort =
      extracted.timeSort === "ASC" || extracted.timeSort === "DESC" ? extracted.timeSort : null;

    const tripsResult = await tripService.getAllFiltered(10, 0, priceSort, timeSort, {
      licensePlate: extracted.licensePlate || "",
      departure: extracted.from,
      arrival: extracted.to,
      startTime,
      endTime,
    });

    const dataTrips = tripsResult.data;
    console.log("dataTrips", dataTrips);

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
