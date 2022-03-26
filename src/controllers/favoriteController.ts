import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() // INSTANCIAR PRISMA EM TODA APLICAÇÃO

export default {
    async get(req: Request, res: Response) {

        // console.log("Request", res.locals.id);
        const response = await prisma.favorite_questions.findMany();
        
        await prisma.$disconnect(); // USAR FINALLY // DESCONECTAR DEPOIS DE QUALQUER CONEXÃO

        return res.status(200).send(response);
    },

    async create(req: Request, res: Response) {
        const { userId, questionId } = req.body

        //VALIDAR SE EXISTEM USERID E QUESTION ID

        // EVITAR RE-FAVORITAR QUESTÃO
        const favorite = await prisma.favorite_questions.findFirst({
            where: {
                user_id: parseInt(userId),
                question_id: parseInt(questionId)
            }
        });

        if(favorite) return res.status(400).send({ message: "Questão já favoritada"});

        await prisma.favorite_questions.create({
            data: {
                user_id: parseInt(userId),
                question_id: parseInt(questionId)
            },
        });
        
        await prisma.$disconnect();

        return res.status(201).send({ message: "Questão favoritada com sucesso" });
    },

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const favorite = await prisma.favorite_questions.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if(!favorite) return res.status(400).send({ message: "Questão favoritada não encontrada"})

        await prisma.favorite_questions.delete({
            where: {
                id: parseInt(id)
            }
        });

        await prisma.$disconnect();

        return res.status(201).send({ message: "Questão favoritada deletada com sucesso" }); // MUDAR STATUS
    },
}