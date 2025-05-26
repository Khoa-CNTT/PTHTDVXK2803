import { faRocketchat } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { useUserStore } from "../store/userStore";
import styles from "../styles/chatBox.module.scss";
import { ResponseData } from "../types/chatbox";
import { TripData } from "../types/trip";
import TripCardInChatBox from "./TripCardInChatBox";

type Message = {
  from?: "user" | "bot";
  text?: string;
  id?: number;
  trips?: TripData[];
  timestamp?: number;
};

const ChatBox = () => {
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.user?.id);
  const socket = useRef<Socket | null>(null);
  const chatboxRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUserStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Xin chào tôi có thể giúp gì cho bạn?" },
  ]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutSide);
      return () => document.removeEventListener("mousedown", handleClickOutSide);
    }
  }, [open]);

  useEffect(() => {
    if (!userId || !open) return;

    socket.current = io(`https://${import.meta.env.VITE_API_URL}.ngrok-free.app`, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      autoConnect: true,
    });

    socket.current.on("connect", () => {
      console.log("Socket connected with id", socket.current?.id);
      setIsConnected(true);
      socket.current?.emit("register_user", userId);
    });

    socket.current.on("user_registered", (data) => {
      console.log("User registered successfully", data);
    });

    socket.current.on("custom_error", (error) => {
      console.error("Socket error", error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: `Lỗi: ${error}`,
          timestamp: Date.now(),
        },
      ]);
    });

    // Nhận phản hồi từ câu hỏi
    socket.current.on("question_response", (data: ResponseData) => {
      console.log("Received response:", data.trips);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: data.answer,
          trips: data.trips,
          timestamp: data.timestamp,
        },
      ]);
    });

    // Xác nhận câu hỏi đã được nhận
    socket.current.on("question_received", (data) => {
      if (!data) toast.error("Lỗi mấy chủ");
    });

    // Xử lý lỗi khi gửi câu hỏi
    socket.current.on("question_error", (error) => {
      console.error("Question error:", error);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: `Lỗi: ${error.message}`,
          timestamp: error.timestamp,
        },
      ]);
    });

    socket.current.on("disconnect", (reason) => {
      console.log("Socket disconnected", reason);
      setIsConnected(false);
    });

    socket.current.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [userId, open]);

  const handleOpenChat = () => {
    if (!user) {
      navigate("/login");
    } else {
      setOpen(true);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    if (!socket.current || !isConnected) {
      console.warn("Socket chưa kết nối");
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Kết nối chưa sẵn sáng. Vui lòng thử lại sau.",
          timestamp: Date.now(),
        },
      ]);
      return;
    }

    // Thêm tin nhắn của user vào ChatBox
    const userMessage: Message = {
      from: "user",
      text: input,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Gửi câu hỏi tới server qua socket
    socket.current.emit("user_question", {
      userId: userId?.toString(),
      question: input,
      timestamp: Date.now(),
    });

    setIsLoading(true);
    setInput("");

    // loading message
    setTimeout(() => {
      if (isLoading) {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: "Đang xử lý câu hỏi của bạn...",
            timestamp: Date.now(),
          },
        ]);
      }
    }, 1000);
  };

  const handleClickOutSide = (e: MouseEvent) => {
    if (chatboxRef.current && !chatboxRef.current.contains(e.target as Node)) {
      setOpen(false);
    } else {
      return;
    }
  };

  return (
    <div ref={chatboxRef} className={styles["chat-container"]}>
      {!open ? (
        <button type="button" onClick={handleOpenChat} className={styles["chat-button"]}>
          <FontAwesomeIcon className={styles["ic-message"]} icon={faRocketchat} />
        </button>
      ) : (
        <div className={styles["chat-box"]}>
          <div className={styles["chat-header"]}>
            <span>Chat VeXeTienIch</span>
            <span
              className={`${styles["status"]} ${
                isConnected ? styles["online"] : styles["offline"]
              }`}
            >
              {isConnected ? "Online" : "Offline"}
            </span>
          </div>
          <div className={styles["message-list"]}>
            {messages.map((msg, idx) => (
              <div key={msg.id ?? idx} className={`${styles["message"]}`}>
                {msg.from === "user" ? (
                  <div className={styles["message-user"]}>
                    <div className={styles.right}>
                      <p className={styles["message-text__user"]}>
                        {msg?.text?.split("\n").map((line, i) => (
                          <span key={i} className={styles["message-text__user-content"]}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </p>
                    </div>

                    {msg.timestamp && (
                      <div className={styles.timestamp}>
                        <small className={styles["timestamp-content"]}>
                          {new Date(msg.timestamp).toLocaleTimeString("vi-VN")}
                        </small>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles["message-bot"]}>
                    <div className={styles.left}>
                      <p className={styles["message-text__bot"]}>
                        {msg?.text?.split("\n").map((line, i) => (
                          <span key={i} className={styles["message-text__bot-content"]}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </p>
                    </div>
                    <div key={idx} className="trips">
                      {msg.trips?.map((t, idx) => (
                        <TripCardInChatBox key={idx} trip={t} />
                      ))}
                    </div>
                    {msg.timestamp && (
                      <div className={styles.timestamp}>
                        <small className={styles["timestamp-content"]}>
                          {new Date(msg.timestamp).toLocaleTimeString("vi-VN")}
                        </small>
                      </div>
                    )}
                  </div>
                )}
                <div ref={messageEndRef}></div>
              </div>
            ))}
            {/* Loading */}
            {isLoading && open && (
              <div className={styles["message"]}>
                <div className={styles["message-bot"]}>
                  <p className={styles["message-text__bot"]}>
                    <span className={styles["typing-indicator"]}>
                      Đang trả lời
                      <span className={styles["dots"]}>.</span>
                      <span className={styles["dots"]}>.</span>
                      <span className={styles["dots"]}>.</span>
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className={styles["input-area"]}>
            <div className={styles["chat-message"]}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isConnected ? "Nhập câu hỏi..." : "Đang kết nối..."}
                className={styles["chat-textarea"]}
                rows={1}
                disabled={!isConnected || isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                onClick={handleSend}
                disabled={!isConnected || isLoading || !input.trim()}
                className={`${styles["send-btn"]} ${styles.btn}`}
              >
                {isLoading ? "Đang gửi..." : "Gửi"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={`${styles["close-btn"]} ${styles.btn}`}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
