import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.user;

    if(!user || user.role !== 'admin') {
        return res.sendStatus(403);
    }
    next();
};