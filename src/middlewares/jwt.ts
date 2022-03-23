import { Request, Response, NextFunction } from "express";
import { Decoded, ParamsAcess } from "../interfaces/jwt";
import { verify, JwtPayload } from 'jsonwebtoken';

type RequestAcess = Request<ParamsAcess>; //DEFINIR MAIS TYPE
// type Teste = JwtPayload<Decoded>
// type Code = {
//     [key: string]: string | number
// }

type jwtRequest = {
    id: number,
    iat: number,
    exp: number
}

// interface JwtPayload {
//   _id: string
// }

export default {
    userAccess(req: Request, res: Response, next: NextFunction) { // O REQUEST ACESS DÁ ERRO NO MIDDLEWARE, PRECISARIA DEFINIR UM CONTEXTO GLOBAL DO EXPRESS
        const token = req.headers.authorization
        
        // if(!token) return next({ status: 401, message: 'Token inválido' });
        if(!token) return res.status(401).send({ message: 'Token não informado' });
        
        try{
            const { id } = verify(token.split(' ')[1], process.env.JWT_SECRET_USER || 'secret@123') as jwtRequest // NÃO RETORNA O ERR
            res.locals.id = id
            next()
        }catch(e) {
            // OU USAR NEXT ERROR
            return res.status(403).send({ message: "Token inválido"});
        }

        // if(!validation) return res.status(401).send({ message: 'Acesso inválido' });

        // verify(token.split(' ')[1], process.env.JWT_SECRET_USER || 'secret@123', (err, decoded) => {
        //     // const x = decoded?.id
        //     // if(err) return next({ status: 401, message: 'Acesso inválido' });
        //     if(err) return res.status(401).send({ message: 'Acesso inválido' });
        //     // res.locals.jwt = decoded.id
        //     // req.userId = decoded.id
        //     next()

        // })
        

    }
}