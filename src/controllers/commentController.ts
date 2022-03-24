import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default {
    async test(req: Request, res: Response) {

        // console.log("Request", res.locals.id);
        const response = await prisma.users.findMany();
        
        await prisma.$disconnect(); // USAR FINALLY // DESCONECTAR DEPOIS DE QUALQUER CONEXÃO

        return res.status(200).send(response);
    }
}