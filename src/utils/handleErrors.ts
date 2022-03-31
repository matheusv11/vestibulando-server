import {Request, Response, NextFunction } from "express";

type ErrorType = {
    status: number,
    message: string
}

export default (err: ErrorType, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        return res.status(err.status || 500).json({
            message: err.message
       });
    }
}