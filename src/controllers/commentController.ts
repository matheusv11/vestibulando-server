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
        const { comment, questionId, userId } = req.body

        // BOM VALIDAR O QUESTIONID E USERID
        // OU UM CATCH GLOBAL PARA DISPARAR OS ERROS

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

        const comment = await prisma.comments.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if(!comment) return res.status(400).send({ message: "Comentário não encontrado"});

        await prisma.comments.update({
            where: {
                id: parseInt(id)
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

        const comment = await prisma.comments.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if(!comment) return res.status(400).send({ message: "Comentário não encontrado"});

        await prisma.comments.delete({
            where: {
                id: parseInt(id)
            }
        })

        await prisma.$disconnect();

        return res.status(201).send({ message: "Comentário deletado com sucesso" }); // MUDAR STATUS
    },
}