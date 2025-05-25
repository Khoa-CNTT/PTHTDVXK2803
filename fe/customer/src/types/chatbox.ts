import { TripData } from "./trip";

export interface ResponseData {
  questionId?: string;
  answer: string;
  timestamp: number;
  trips: TripData[];
  status: "success" | "error";
}
