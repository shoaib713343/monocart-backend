import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { 
        id: number; 
        email: string; 
        fullName: string; 
        role: 'admin' | 'customer';
        isEmailVerified: boolean; 
        isPhoneVerified: boolean; 
      };
    }
  }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.sendStatus(401);
    }

    const secret = process.env.JWT_SECRET!;

    jwt.verify(token, secret, (err: jwt.VerifyErrors | null, user: string | jwt.JwtPayload | undefined) => {
        if(err) {
            return res.sendStatus(403);
        }
         req.user = user as { id: number; email: string; fullName: string, role: 'admin' | 'customer'; isEmailVerified: boolean;
        isPhoneVerified: boolean;}
         next();
    })
}