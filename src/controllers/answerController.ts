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
        const { selected, questionId, userId } = req.body // OS ID PODERIA VIR DO HEADER

        // VALIDAR SE O USER E QUESTION ID EXISTEM
        
        // const { answer: correct }
        const correct = await prisma.questions.findUnique({
            where: {
                id: parseInt(questionId)
            }
        }); 

        // TS RECLAMA SEM TER IF, POR PODER SER NULO

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
        // PEGAR RESPOSTA CERTO POR DB QUERY, PARAMS OU BODY?
        // BUSCAR PELA QUERY ABAIXO COM A RELAÇÃO DO PRISMA

        const answer = await prisma.answers.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if(!answer) return res.status(400).send({ message: "Resposta não encontrada"})
    
        // VALIDAR O QUESTION ID
        const correct = await prisma.questions.findUnique({
            where: {
                id: parseInt(questionId)
            }
        }); 
        
        await prisma.answers.update({
            where: {
                id: parseInt(id) // USAR OUTRO WHERE PARA O QUESTION ID E USER ID
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

        const answer = await prisma.answers.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if(!answer) return res.status(400).send({ message: "Resposta não encontrada"})

        await prisma.answers.delete({
            where: {
                id: parseInt(id)
            }
        });

        await prisma.$disconnect();

        return res.status(201).send({ message: "Resposta deletada com sucesso" }); // MUDAR STATUS
    },
}