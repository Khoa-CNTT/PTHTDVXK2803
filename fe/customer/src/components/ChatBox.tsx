import { useRef, useState } from "react";

import styles from "../styles/chatBox.module.scss";
import { TripInfoBase } from "../types/trip";
import { useUserStore } from "../store/userStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocketchat } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router";

type Message = {
  from: string;
  text: string;
  id?: number;
  infoTrip?: TripInfoBase;
};

const ChatBox = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  // useEffect(() => {
  //   const socket = new WebSocket(`wss://${import.meta.env.VITE_API_URL}.ngrok-free.app/ws/chat`);
  //   socketRef.current = socket;

  //   socket.onopen = () => {
  //     console.log("WebSocket connected");
  //   };

  //   socket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);

  //     if (data.type === "chat" || data.type === "system") {
  //       if (data.trips && Array.isArray(data.trips)) {
  //         const tripMessages = data.trips.map((trip: TripInfoBase) => {
  //           const start = new Date(trip.startTime).toLocaleString();
  //           const end = new Date(trip.endTime).toLocaleString();

  //           const text =
  //             `Tên chuyến: ${trip.tripName}\n` +
  //             `Biển số xe: ${trip.licensePlate}\n` +
  //             `Tài xế: ${trip.driverName}\n` +
  //             `Thời gian bắt đầu: ${start}\n` +
  //             `Thời gian kết thúc: ${end}\n` +
  //             `Giá tiền: ${trip.price} VND\n` +
  //             `Số chỗ còn lại: ${trip.totalSeatAvailable}`;

  //           return {
  //             from: "bot",
  //             text,
  //             id: trip.id,
  //             infoTrip: trip,
  //           };
  //         });

  //         setMessages((prev) => [...prev, ...tripMessages]);
  //       } else {
  //         setMessages((prev) => [...prev, { from: "bot", text: data.message }]);
  //       }
  //     }
  //   };

  //   socket.onclose = () => {
  //     console.log("WebSocket disconnected");
  //   };

  //   socket.onerror = (error) => {
  //     console.error("WebSocket error", error);
  //   };

  //   return () => {
  //     socket.close();
  //   };
  // }, []);

  const handleOpenChat = () => {
    if (!user) {
      navigate("/login");
    } else {
      setOpen(true);
    }
  };

  const handleSend = () => {
    if (!input) return;

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          message: input,
          language: "vi",
        })
      );

      setMessages((prev) => [...prev, { from: "user", text: input }]);
      setInput("");
    } else {
      console.warn("WebSocket chưa kết nối hoặc đã đóng");
    }
  };

  const handleDetailTrip = (
    departure: string,
    arrival: string,
    startTime: string,
    licensePlate: string
  ) => {
    alert(
      `Điểm đi: ${departure}, điểm đến: ${arrival}, thời gian khởi hành ${startTime}, biển số xe: ${licensePlate}`
    );
  };

  return (
    <div className={styles["chat-container"]}>
      {!open ? (
        <button type="button" onClick={handleOpenChat} className={styles["chat-button"]}>
          <FontAwesomeIcon className={styles["ic-message"]} icon={faRocketchat} />
        </button>
      ) : (
        <div className={styles["chat-box"]}>
          <div className={styles["message-list"]}>
            {messages.map((msg, idx) => (
              <div key={msg.id ?? idx} className={`${styles["message"]}`}>
                {msg.from === "user" ? (
                  <p className={styles["message-text__user"]}>
                    <br />
                    {msg.text.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className={styles["message-text__bot"]}>
                    <br />
                    {msg.text.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                )}
                {msg.infoTrip && (
                  <button
                    className={styles["search-trip-btn"]}
                    type="button"
                    onClick={() =>
                      handleDetailTrip(
                        msg.infoTrip!.departure,
                        msg.infoTrip!.arrival,
                        msg.infoTrip!.startTime,
                        msg.infoTrip!.licensePlate
                      )
                    }
                  >
                    Xem chuyến
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className={styles["input-area"]}>
            <div className={styles["chat-message"]}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập câu hỏi..."
                className={styles["chat-textarea"]}
                rows={1}
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
                className={`${styles["send-btn"]} ${styles.btn}`}
              >
                Gửi
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
