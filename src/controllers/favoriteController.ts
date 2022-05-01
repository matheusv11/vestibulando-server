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
        const { questionId } = req.body
        const { userId } = res.locals

        const favorite = await prisma.favorite_questions.findFirst({
            where: {
                user_id: parseInt(userId),
                question_id: parseInt(questionId)
            }
        });
        
        if(favorite) return res.status(400).send({ message: "Questão já favoritada"});
        
        const question = await prisma.questions.findUnique({
            where: {
                id: parseInt(questionId)
            }
        });

        if(!question) return res.status(400).send({ message: "Questão não encontrada" });

        const create = await prisma.favorite_questions.create({
            data: {
                user_id: parseInt(userId),
                question_id: parseInt(questionId)
            },
        });
        
        await prisma.$disconnect();

        return res.status(201).send({ id: create.id, message: "Questão favoritada com sucesso" });
    },

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const { userId } = res.locals

        const favorite = await prisma.favorite_questions.findFirst({
            where: {
                id: parseInt(id),
                user_id: parseInt(userId)
            }
        });

        if(!favorite) return res.status(400).send({ message: "Questão favoritada não encontrada"})

        await prisma.favorite_questions.deleteMany({
            where: {
                id: parseInt(id),
                user_id: parseInt(userId)
            }
        });

        await prisma.$disconnect();

        return res.status(201).send({ message: "Questão favoritada deletada com sucesso" }); // MUDAR STATUS
    },
}