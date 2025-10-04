import { Request, Response, NextFunction } from 'express';

export const verifiedUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  // This check is a safeguard, though authMiddleware should handle it
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Check if neither email nor phone is verified
  if (!user.isEmailVerified && !user.isPhoneVerified) {
    return res.status(403).json({
      message: 'Forbidden: Please verify your email or phone number to perform this action.',
    });
  }

  // If at least one is verified, proceed
  next();
};