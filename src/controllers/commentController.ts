import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() // INSTANCIAR PRISMA EM TODA APLICAÇÃO

export default {
    async get(req: Request, res: Response) {

        // console.log("Request", res.locals.id);
        const response = await prisma.comments.findMany();
        
        await prisma.$disconnect(); // USAR FINALLY // DESCONECTAR DEPOIS DE QUALQUER CONEXÃO

        return res.status(200).send(response);
    },

    async create(req: Request, res: Response) {
        const { comment, questionId } = req.body
        const { userId } = res.locals

        const question = await prisma.questions.findUnique({
            where: {
                id: parseInt(questionId)
            }
        });

        if(!question) return res.status(400).send({ message: "Questão não encontrada"});

        await prisma.comments.create({
            data: {
                comment,
                question_id: parseInt(questionId),
                user_id: parseInt(userId)
            },
        });

        await prisma.$disconnect();

        return res.status(201).send({ message: "Comentário criado com sucesso" });
    },

    async update(req: Request, res: Response) {
        const { comment: commentText } = req.body;
        const { id } = req.params;
        const { userId } = res.locals

        const comment = await prisma.comments.findFirst({
            where: {
                id: parseInt(id),
                user_id: parseInt(userId)
            }
        });

        if(!comment) return res.status(400).send({ message: "Comentário não encontrado"});

        await prisma.comments.updateMany({
            where: {
                id: parseInt(id),
                user_id: parseInt(userId)
            },
            data: {
                comment: commentText
            },
        });

        await prisma.$disconnect();

        return res.status(201).send({ message: "Comentário atualizado com sucesso" }); // MUDAR STATUS
    },

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const { userId } = res.locals

        const comment = await prisma.comments.findFirst({
            where: {
                id: parseInt(id),
                user_id: parseInt(userId)
            }
        });

        if(!comment) return res.status(400).send({ message: "Comentário não encontrado"});

        await prisma.comments.deleteMany({
            where: {
                id: parseInt(id),
                user_id: parseInt(userId)
            }
        });

        await prisma.$disconnect();

        return res.status(201).send({ message: "Comentário deletado com sucesso" }); // MUDAR STATUS
    },
}