import { NextFunction, Request, Response } from "express";

export default (req: Request, res: Response, next: NextFunction) => {

    process.on("unhandledRejection", (reason: Error)=>{
        next({ status: 500, message: "Ocorreu um erro no sistema"}) //ADICIONAR O TIPO NO NEXTFUNCTION
    });

    next();

}