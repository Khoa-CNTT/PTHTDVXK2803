import { io } from "socket.io-client";
const socket = io(`https://${import.meta.env.VITE_API_URL}.ngrok-free.app/api`);

export default socket;
