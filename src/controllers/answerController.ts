import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // INSTANCIAR PRISMA EM TODA APLICAÇÃO

export default {
    async get(req: Request, res: Response) {

        const response = await prisma.answers.findMany();
        
        await prisma.$disconnect();

        return res.status(200).send(response);
    },

    async create(req: Request, res: Response) {
        const { selected, questionId } = req.body
        const { userId } = res.locals

        const answer = await  prisma.answers.findFirst({
            where: {
                question_id: parseInt(questionId),
                user_id: parseInt(userId)
            }
        });

        if(answer) return res.status(400).send({ message: "Resposta já criada"});
        
        const question = await prisma.questions.findUnique({
            where: {
                id: parseInt(questionId)
            }
        });

        if(!question) return res.status(400).send({ message: "Questão não encontrada"});
        
        // VALIDAR SE O SELECTED TÁ NA FAIXA DE ALTERNATIVAS
        await prisma.answers.create({
            data: {
                correct: question?.answer === selected,
                selected,
                resolution_date: new Date(), //ISO STRING
                user_id: parseInt(userId),
                question_id: parseInt(questionId)
            },
        });

        await prisma.$disconnect();

        return res.status(201).send({ message: "Resposta criada com sucesso" });
    },

    async update(req: Request, res: Response) {
        const { selected } = req.body;
        const { id } = req.params; // USAR FORMA DE PEGA A RESPOSTA CERTA SEM PRECISAR PASSAR OUTRA ID DE QUESTAO
        const { userId } = res.locals;
        // PODE ZUAR CASO MUDE A RESPOSTA AQUI, POIS VAI DIVERGIR NO CREATE
        // PEGAR RESPOSTA CERTO POR DB QUERY, PARAMS OU BODY?
        // BUSCAR PELA QUERY ABAIXO COM A RELAÇÃO DO PRISMA

        const answer = await prisma.answers.findFirst({
            where: {
                id: parseInt(id),
                user_id: parseInt(userId)
            }
        });

        if(!answer) return res.status(400).send({ message: "Resposta não encontrada"});
    
        const correct = await prisma.questions.findUnique({
            where: {
                id: answer.question_id
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

        const answer = await prisma.answers.findFirst({
            where: {
                id: parseInt(id),
                user_id: parseInt(userId)
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