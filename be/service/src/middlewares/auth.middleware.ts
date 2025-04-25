export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permission" });
    }
    next();
  };
};
