import { Server } from "socket.io";
import { bookBusTicketsDB } from "../config/db";
import OpenAI from "openai";
import { TripData } from "../@types/trip";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let io: Server;
const userSocketMap = new Map<string, string>();

interface QuestionData {
  userId: string;
  question: string;
  timestamp?: number;
}

interface ResponseData {
  questionId?: string;
  answer: string;
  timestamp: number;
  trips: TripData[];
  status: "success" | "error";
}

interface GPTAnalysisResult {
  answer: string;
  filteredTrips: TripData[];
}

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    allowUpgrades: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    socket.on("register_user", (userId: number) => {
      if (!userId) {
        socket.emit("custom_error", "userId không hợp lệ");
        return;
      }
      console.log("userId connect", userId);
      const userIdStr = userId.toString();
      userSocketMap.set(userIdStr, socket.id);

      socket.emit("user_registered", {
        userId: userIdStr,
        socketId: socket.id,
        message: "User registered successfully",
      });
    });

    socket.on("payment_status_client", (userId: string) => {
      sendToUser(userId, "payment-status", { status: "success" });
    });

    socket.on("user_question", async (data: QuestionData) => {
      try {
        const { userId, question } = data;

        if (!userId || !question) {
          socket.emit("question_error", {
            message: "UserId và question không được để trống",
            timestamp: Date.now(),
          });
          return;
        }

        console.log(`Received question from user ${userId}: ${question}`);

        // Xử lý câu hỏi và lấy cả answer và filtered trips
        const result = await processQuestion(question, userId);
        const response: ResponseData = {
          answer: result.answer,
          trips: result.filteredTrips,
          timestamp: Date.now(),
          status: "success",
        };

        sendToUser(userId, "question_response", response);

        socket.emit("question_received", {
          message: "Câu hỏi đã được xử lý thành công",
          questionId: `q_${Date.now()}`,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error("Error processing question:", error);
        socket.emit("question_error", {
          message: "Có lỗi xảy ra khi xử lý câu hỏi",
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: Date.now(),
        });
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, sId] of userSocketMap.entries()) {
        if (sId === socket.id) {
          console.log("user-disconnect", sId);
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });
};

const isSearchTripQuestion = (question: string): boolean => {
  const searchKeywords = [
    "chuyến",
    "xe",
    "bus",
    "tìm",
    "search",
    "lịch trình",
    "khởi hành",
    "xuất phát",
    "thời gian",
    "giờ",
    "ngày",
    "từ",
    "đến",
    "đi",
    "về",
    "tuyến",
    "route",
    "hà nội",
    "tp hcm",
    "sài gòn",
    "đà nẵng",
    "huế",
    "nha trang",
    "hải phòng",
    "cần thơ",
    "vũng tàu",
    "đà lạt",
    "quy nhon",
    "giá",
    "vé",
    "ticket",
    "chỗ ngồi",
    "ghế",
    "seat",
    "còn",
    "available",
    "trống",
    "book",
    "đặt",
    "tài xế",
    "driver",
    "lái xe",
    "biển số",
    "license plate",
  ];

  const lowerQuestion = question.toLowerCase();
  return searchKeywords.some((keyword) => lowerQuestion.includes(keyword));
};

const getTripsFromDB = async (): Promise<TripData[]> => {
  try {
    const [rows] = await bookBusTicketsDB.execute("CALL get_trips()");
    return rows[0] || [];
  } catch (error) {
    console.error("Error fetching trips:", error);
    return [];
  }
};

// Tạo prompt mới để GPT trả về JSON có cấu trúc
const createGPTPrompt = (userQuestion: string, trips: TripData[], userName: string): string => {
  const tripsData = JSON.stringify(trips, null, 2);

  return `
  Bạn là một trợ lý AI chuyên về tìm kiếm và tư vấn chuyến xe bus tại Việt Nam.

  THÔNG TIN NGƯỜI DÙNG:
  - Tên: ${userName}
  - Câu hỏi: "${userQuestion}"

  DỮ LIỆU CHUYẾN XE HIỆN CÓ:
  ${tripsData}

  HƯỚNG DẪN TRẢ LỜI:
  1. Phân tích câu hỏi của người dùng để hiểu họ muốn tìm gì
  2. Lọc ra các chuyến xe phù hợp với yêu cầu từ dữ liệu đã cho
  3. Trả lời CHÍNH XÁC theo format JSON sau:

  {
    "answer": "Câu trả lời bằng tiếng Việt, thân thiện và chi tiết cho người dùng",
    "filteredTrips": [
      // Mảng các object chuyến xe phù hợp, giữ nguyên cấu trúc TripData
      // Chỉ bao gồm những chuyến thực sự khớp với yêu cầu
      // Sắp xếp theo độ ưu tiên (thời gian, giá, v.v.)
    ]
  }

  QUY TẮC LỌC CHUYẾN:
  - Nếu hỏi về tuyến đường: lọc theo departureLocation và arrivalLocation
  - Nếu hỏi về thời gian: lọc theo startTime, endTime
  - Nếu hỏi về giá: lọc theo price, sắp xếp theo giá
  - Nếu hỏi về ghế trống: lọc theo totalSeatAvailable > 0
  - Nếu hỏi về tài xế: lọc theo driverName
  - Nếu hỏi về biển số: lọc theo licensePlate
  - Nếu hỏi chung chung: trả về các chuyến phù hợp nhất

  ĐIỀU KIỆN QUAN TRỌNG:
  - CHẮC CHẮN trả về JSON hợp lệ
  - filteredTrips phải là mảng các object có cấu trúc giống TripData
  - Không bịa đặt dữ liệu không có trong danh sách gốc
  - Nếu không tìm thấy chuyến phù hợp, filteredTrips = []
  - answer luôn bằng tiếng Việt, gọi người dùng bằng tên ${userName}

  Ví dụ response:
  {
    "answer": "Chào ${userName}! Tôi đã tìm thấy 3 chuyến xe từ Hà Nội đến TP.HCM phù hợp với yêu cầu của bạn. Các chuyến được sắp xếp theo thời gian khởi hành.",
    "filteredTrips": [...]
  }

  Hãy phân tích và trả lời cho câu hỏi: "${userQuestion}"`;
};

// Hàm gọi GPT API và parse JSON response
const callGPTAPI = async (prompt: string): Promise<GPTAnalysisResult> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Bạn là trợ lý AI chuyên tư vấn xe bus tại Việt Nam. 
          BẮT BUỘC trả lời theo format JSON với 2 trường: "answer" (string) và "filteredTrips" (array).
          Không thêm markdown, không thêm text nào khác ngoài JSON.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 4000,
      temperature: 0.3,
    });

    const gptResponse = completion.choices[0]?.message?.content || "";

    try {
      const parsedResponse = JSON.parse(gptResponse) as GPTAnalysisResult;

      if (!parsedResponse.answer || !Array.isArray(parsedResponse.filteredTrips)) {
        throw new Error("Invalid response structure");
      }

      return parsedResponse;
    } catch (parseError) {
      console.error("Error parsing GPT JSON response:", parseError);

      // Fallback response
      return {
        answer: "Xin lỗi, có lỗi khi xử lý phản hồi. Vui lòng thử lại hoặc diễn đạt câu hỏi khác.",
        filteredTrips: [],
      };
    }
  } catch (error) {
    console.error("Error calling GPT API:", error);

    return {
      answer: "Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi của bạn. Vui lòng thử lại sau.",
      filteredTrips: [],
    };
  }
};

const processQuestion = async (question: string, userId: string): Promise<GPTAnalysisResult> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const [rowUser] = await bookBusTicketsDB.execute("SELECT full_name FROM user WHERE id = ?", [
      userId,
    ]);

    const getUserName = rowUser[0]?.full_name;
    if (!getUserName) {
      return {
        answer: `Xin lỗi, tôi không tìm thấy thông tin của bạn!`,
        filteredTrips: [],
      };
    }

    const lowerQuestion = question.toLowerCase();

    if (
      lowerQuestion.includes("hello") ||
      lowerQuestion.includes("xin chào") ||
      lowerQuestion.includes("hi")
    ) {
      return {
        answer: `Xin chào ${getUserName}! 

  Tôi là trợ lý AI chuyên hỗ trợ tìm kiếm chuyến xe bus. Tôi có thể giúp bạn:

  - Tìm chuyến xe theo tuyến đường
  - Kiểm tra lịch trình khởi hành  
  - So sánh giá vé
  - Xem số ghế trống
  - Thông tin tài xế và xe

  Hãy cho tôi biết bạn muốn đi đâu nhé!`,
        filteredTrips: [],
      };
    }

    if (
      lowerQuestion.includes("help") ||
      lowerQuestion.includes("giúp") ||
      lowerQuestion.includes("hướng dẫn")
    ) {
      return {
        answer: `${getUserName}, tôi có thể giúp bạn:

  - Tìm chuyến xe:
    • "Tìm chuyến từ Hà Nội đến TP.HCM"
    • "Xe đi Đà Nẵng khởi hành 8h sáng"

  - Kiểm tra giá:
    • "Giá vé đi Nha Trang"
    • "Chuyến nào rẻ nhất?"

  - Xem chỗ trống:
    • "Còn chỗ không?"
    • "Có bao nhiêu ghế trống?"

  Hãy thử hỏi tôi nhé!`,
        filteredTrips: [],
      };
    }

    if (isSearchTripQuestion(question)) {
      const trips = await getTripsFromDB();

      if (trips.length === 0) {
        return {
          answer: `Xin lỗi ${getUserName}, hiện tại không có chuyến xe nào khả dụng trong hệ thống.

  Vui lòng:
  - Liên hệ hotline để biết thêm thông tin
  - Thử lại sau
  - Kiểm tra lại ngày đi

  Cảm ơn bạn đã sử dụng dịch vụ!`,
          filteredTrips: [],
        };
      }
      const prompt = createGPTPrompt(question, trips, getUserName);
      const gptResult = await callGPTAPI(prompt);

      return gptResult;
    }

    return {
      answer: `Cảm ơn ${getUserName} đã hỏi!

  Tôi chuyên hỗ trợ tìm kiếm thông tin chuyến xe bus. Bạn có thể hỏi tôi về:

  - Tìm chuyến xe: "Tìm xe từ Hà Nội đến Huế"
  - Lịch trình: "Chuyến nào khởi hành sáng sớm?"
  - Giá vé: "Giá vé đi Đà Lạt bao nhiêu?"
  - Chỗ trống: "Còn ghế không?"
  Thông tin xe: "Tài xế là ai?"

  Hãy thử hỏi tôi nhé!`,
      filteredTrips: [],
    };
  } catch (error) {
    console.error("Error in processQuestion:", error);
    return {
      answer: `Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi. 

  Vui lòng:
  • Thử lại sau ít phút
  • Kiểm tra kết nối mạng  
  • Liên hệ hỗ trợ nếu lỗi tiếp tục

  Cảm ơn sự thông cảm!`,
      filteredTrips: [],
    };
  }
};

export const sendToUser = (userId: string | number, event: string, payload: any) => {
  const userIdStr = userId.toString();
  const socketId = userSocketMap.get(userIdStr);

  if (socketId && io) {
    io.to(socketId).emit(event, payload);
    return true;
  } else {
    console.log(`User ${userIdStr} not found or not connected`);
    return false;
  }
};

export const broadcastToAllUsers = (event: string, payload: any) => {
  if (io) {
    io.emit(event, payload);
    return true;
  }
  return false;
};

export const getOnlineUsers = (): string[] => {
  return Array.from(userSocketMap.keys());
};

export { io, userSocketMap };
