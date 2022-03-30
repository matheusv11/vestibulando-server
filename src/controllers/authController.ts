import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
// const refreshTokens = [];

export default {
    async auth(req: Request, res: Response) {

        const { email, password } = req.body
        
        const result = await prisma.users.findFirst({
            where: {
                email: email
            }
        });

        if(!result || !await bcrypt.compare(password, result.password) ){
            return res.status(401).send({ message: 'Email ou senha incorretos' });
            // return next({status: 401, message: 'Email ou senha incorretos'});
        }

        const acessToken= jwt.sign({ id: result.id }, process.env.JWT_SECRET || 'secret@123', {
            expiresIn: '240min'
        });

        const refreshToken= jwt.sign({ id: result.id }, process.env.REFRESH_JWT_SECRET || 'refreshSecret@123', {
            expiresIn: '1m'
        });

        // res.locals.refreshTokens = [...res.locals.refreshTokens, refreshToken];
        // refreshTokens.push(refreshToken);

        await prisma.$disconnect(); // USAR FINALLY // DESCONECTAR DEPOIS DE QUALQUER CONEXÃO
        
        return res.status(200).send({ acessToken, refreshToken });

    },

    async token(req: Request, res: Response) {
        const token = req.headers.authorization
        
        if(!token) return res.status(401).send({ message: 'Token não informado' });

        
    }
}