import { Request, Response } from "express";

export class AuthController {
  static googleAuthSuccess(req: Request, res: Response) {
    res.send("Đăng nhập Google thành công!");
  }

  static facebookAuthSuccess(req: Request, res: Response) {
    res.send("Đăng nhập Facebook thành công!");
  }

  static logout(req: Request, res: Response) {
    req.logout((err) => {
      if (err) return res.status(500).send("Lỗi đăng xuất");
      res.redirect("/");
    });
  }
}
