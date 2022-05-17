import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { hash } from "bcrypt";

const prisma = new PrismaClient()

export default {
    async get(req: Request, res: Response) {
        const response = await prisma.users.findMany();
        
        await prisma.$disconnect(); // USAR FINALLY // DESCONECTAR DEPOIS DE QUALQUER CONEXÃO

        return res.status(200).send(response);
    },

    async actualUser(req: Request, res: Response) { // CONTROLLER DE PROFILE?
        const { userId } = res.locals;

        const user = await prisma.users.findUnique({
            where: {
                id: parseInt(userId)
            }
        });

        return res.status(200).send(user)
    },

    async create(req: Request, res: Response) {
        const { name , email, password } = req.body // TIPAR
        
        const user = await prisma.users.findFirst({ where: { email } });

        // PODE USAR THROW ERROR DO PRISMA
        if(user) return res.status(401).send({ message: "Usuário já existente" });

        const hashPassword = await hash(password, 10); //PODE ARMAZENAR O SALT NO BD E GERA-LO AUTOMATICAMENTE

        await prisma.users.create({ // PRECISA DAS CONFIG DO TSCONFIG
            data: {
                name: name,
                email: email,
                password: hashPassword
            }
        })
        
        await prisma.$disconnect();

        return res.status(201).send({ message: "Usuário criado"});
    }


    // METODO CREATE E DELETE
}