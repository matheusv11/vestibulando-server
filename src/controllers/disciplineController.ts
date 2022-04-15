import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() // INSTANCIAR PRISMA EM TODA APLICAÇÃO

export default {
    async get(req: Request, res: Response) {

        // console.log("Request", res.locals.id);
        const response = await prisma.disciplines.findMany();
        
        await prisma.$disconnect(); // USAR FINALLY // DESCONECTAR DEPOIS DE QUALQUER CONEXÃO

        return res.status(200).send(response);
    },

    async create(req: Request, res: Response) {
        const { name } = req.body;
        // EVITAR MATERIA REPETIDA
        // PODERIA RECEBER UM ARRAY E VALIDAR PARA CADASTRAR VARIOS

        const discipline = await prisma.disciplines.findFirst({
            where: {
                name
            }
        });

        if(discipline) return res.status(401).send({ message: "Matéria já criada"});

        await prisma.disciplines.create({
            data: { // AO CRIAR UMA MATÉRIA DEVERIAR CRIAR OS ASSUNTOS TAMBÉM? // E PODERIA PEGAR OS ASSUNTOS ANTIGOS
                name
            },
        });

        return res.status(201).send({ message: "Matéria criada com sucesso" });
    },

    async update(req: Request, res: Response) {
        const { name } = req.body;
        const { id } = req.params;

        const discipline = await prisma.disciplines.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if(!discipline) return res.status(400).send({ message: "Matéria não encontrada"})

        await prisma.disciplines.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name
            },
        });

        return res.status(201).send({ message: "Matéria atualizada com sucesso" }); // MUDAR STATUS
    },

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const discipline = await prisma.disciplines.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if(!discipline) return res.status(400).send({ message: "Matéria não encontrada"})

        await prisma.disciplines.delete({
            where: {
                id: parseInt(id)
            }
        });

        return res.status(201).send({ message: "Matéria deletada com sucesso" }); // MUDAR STATUS
    },
}