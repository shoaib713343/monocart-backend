import {Request, Response, NextFunction} from 'express';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack);

    return res.status(500).json({ message: 'Something went wrong on the server'});
};