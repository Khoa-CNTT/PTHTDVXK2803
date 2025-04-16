export type ArrangeType = "asc" | "desc";
export type SeatStatusType = "available" | "selected" | "unavailable";

export type ImageType = {
  id?: number;
  urlImg: string;
  publicUrlImg: string;
  createAt?: string;
  updateAt?: string;
};

export type LoginType = {
  email: string;
  password: string;
};
