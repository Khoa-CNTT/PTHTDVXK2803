export const toSeatStatus = (status: string): "available" | "unavailable" | "booked" => {
  if (status === "available" || status === "booked" || status === "unavailable") {
    console.log("status", status);
    return status;
  }
  return "unavailable";
};
