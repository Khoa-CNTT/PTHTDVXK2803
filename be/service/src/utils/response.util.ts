export const successResponse = (res: any, data: any, message: string = "Success") => {
  return res.status(200).json({ success: true, message, data });
};

export const errorResponse = (res: any, message: string = "Error", status: number = 500) => {
  return res.status(status).json({ success: false, message });
};
