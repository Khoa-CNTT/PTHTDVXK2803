import { convertToVietnamTime } from "./convertTime";

type LogType = number | string | object | boolean | null | undefined | Array<any>;

export const log = (message: LogType): void => {
  console.log(`[${convertToVietnamTime(new Date().toISOString())}] ${message}`);
};
