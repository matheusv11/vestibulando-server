import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() // INSTANCIAR PRISMA EM TODA APLICAÇÃO

export default {
    async get(req: Request, res: Response) {

        const response = await prisma.answers.findMany();
        
        await prisma.$disconnect();

        return res.status(200).send(response);
    },

    async create(req: Request, res: Response) {
        const { selected, questionId } = req.body // OS ID PODERIA VIR DO HEADER
        const { userId } = res.locals
        // EVITAR RESPOSTA REPETIDA

        // VALIDAR SE O USER E QUESTION ID EXISTEM
        
        // const { answer: correct }
        const correct = await prisma.questions.findUnique({
            where: {
                id: parseInt(questionId)
            }
        }); 

        await prisma.answers.create({
            data: {
                correct: correct?.answer === selected,
                selected,
                resolution_date: new Date(), //ISO STRING
                user_id: parseInt(userId),
                question_id: parseInt(questionId)
            },
        });

        await prisma.$disconnect();

        return res.status(201).send({ message: "Matéria criada com sucesso" });
    },

    async update(req: Request, res: Response) {
        const { selected, questionId } = req.body; //PEGAR O USER ID PELO TOKEN
        const { id } = req.params; // USAR FORMA DE PEGA A RESPOSTA CERTA SEM PRECISAR PASSAR OUTRA ID DE QUESTAO
        const { userId } = res.locals
        // PEGAR RESPOSTA CERTO POR DB QUERY, PARAMS OU BODY?
        // BUSCAR PELA QUERY ABAIXO COM A RELAÇÃO DO PRISMA

        const answer = await prisma.answers.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        // VALIDAR SE É O DO USUARIO TAMBÉM
        if(!answer) return res.status(400).send({ message: "Resposta não encontrada"});
    
        // VALIDAR O QUESTION ID
        const correct = await prisma.questions.findUnique({
            where: {
                id: parseInt(questionId)
            }
        }); 
        
        await prisma.answers.updateMany({
            where: {
                id: parseInt(id),
                user_id: parseInt(userId)
            },
            data: {
                correct: correct?.answer === selected,
                selected
            },
        });

        await prisma.$disconnect();

        return res.status(201).send({ message: "Resposta atualizada com sucesso" }); // MUDAR STATUS
    },

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const { userId } = res.locals

        const answer = await prisma.answers.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if(!answer) return res.status(400).send({ message: "Resposta não encontrada"})

        await prisma.answers.deleteMany({
            where: {
                id: parseInt(id),
                user_id: parseInt(userId)
            }
        });

        await prisma.$disconnect();

        return res.status(201).send({ message: "Resposta deletada com sucesso" }); // MUDAR STATUS
    },
}