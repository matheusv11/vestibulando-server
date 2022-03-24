import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() // INSTANCIAR PRISMA EM TODA APLICAÇÃO

export default {
    async get(req: Request, res: Response) {

        // console.log("Request", res.locals.id);
        const response = await prisma.themes.findMany();
        
        await prisma.$disconnect(); // USAR FINALLY // DESCONECTAR DEPOIS DE QUALQUER CONEXÃO

        return res.status(200).send(response);
    },

    async create(req: Request, res: Response) {
        const { name } = req.body // COLOCAR UM JOI
        // EVITAR MATERIA REPETIDA
        // PODERIA RECEBER UM ARRAY E VALIDAR PARA CADASTRAR VARIOS

        await prisma.themes.create({
            data: { // AO CRIAR UMA MATÉRIA DEVERIAR CRIAR OS ASSUNTOS TAMBÉM? // E PODERIA PEGAR OS ASSUNTOS ANTIGOS
                name
            },
        });

        return res.status(201).send({ message: "Matéria criada com sucesso" });
    },

    async update(req: Request, res: Response) {
        const { name } = req.body; // COLOCAR UM JOI
        const { id } = req.params;

        const theme = await prisma.themes.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if(!theme) return res.status(400).send({ message: "Matéria não encontrada"})
        // VALIDAR SE EXISTE PARA ATUALIZAR
        // EVITAR MATERIA REPETIDA
        // PODERIA RECEBER UM ARRAY E VALIDAR PARA CADASTRAR VARIOS

        await prisma.themes.update({
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

        // VALIDAR SE EXISTE PARA DELETAR

        const theme = await prisma.themes.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if(!theme) return res.status(400).send({ message: "Matéria não encontrada"})

        await prisma.themes.delete({
            where: {
                id: parseInt(id)
            }
        })

        return res.status(201).send({ message: "Matéria deletada com sucesso" }); // MUDAR STATUS
    },
}