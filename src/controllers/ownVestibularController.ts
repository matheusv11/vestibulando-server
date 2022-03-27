import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() // INSTANCIAR PRISMA EM TODA APLICAÇÃO

export default {
    async get(req: Request, res: Response) {

        const response = await prisma.own_vestibulars.findMany({
            include: {
                own_vestibular_questions: {
                    include: {
                        question: true
                    }
                }
            }
        });
        
        await prisma.$disconnect();

        return res.status(200).send(response);
    },

    async create(req: Request, res: Response) {
        const { name, timer, questionsId } = req.body
        const { userId } = res.locals

        await prisma.own_vestibulars.create({
            data: {
                name,
                timer: parseInt(timer),
                user_id: parseInt(userId),
                own_vestibular_questions: {
                    createMany: {
                        data: questionsId.map((id: any) => id = { question_id: parseInt(id) })
                    }
                }
            },
        });

        await prisma.$disconnect();

        return res.status(201).send({ message: "Vestibular próprio criado com sucesso" });
    },

    async update(req: Request, res: Response) {
        const { name, timer, questionsId } = req.body; // PEGAR O USER_ID, MAS SO PARA O WHERE
        const { id } = req.params;
        const { userId } = res.locals

        const vestibular = await prisma.own_vestibulars.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if(!vestibular) return res.status(400).send({ message: "Vestibular próprio não encontrado"})

        await prisma.own_vestibulars.updateMany({
            where: {
                id: parseInt(id),
                user_id: parseInt(userId)
            },
            data: {
                name,
                timer,
                // own_vestibular_questions: { // PENDENTE
                //     createMany: {}
                // }
            },
        });

        await prisma.$disconnect();

        return res.status(201).send({ message: "Vestibular próprio atualizado com sucesso" }); // MUDAR STATUS
    },

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const { userId } = res.locals

        const vestibular = await prisma.own_vestibulars.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if(!vestibular) return res.status(400).send({ message: "Vestibular próprio não encontrado"});

        await prisma.own_vestibulars.deleteMany({
            where: {
                id: parseInt(id),
                user_id: parseInt(userId)
            }
        });

        await prisma.$disconnect();

        return res.status(201).send({ message: "Vestibular próprio deletado com sucesso" }); // MUDAR STATUS
    },
}