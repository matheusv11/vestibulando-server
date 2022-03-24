import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() // INSTANCIAR PRISMA EM TODA APLICAÇÃO

export default {
    async get(req: Request, res: Response) {

        const response = await prisma.vestibulars.findMany();
        
        await prisma.$disconnect();

        return res.status(200).send(response);
    },

    async create(req: Request, res: Response) {
        const { name } = req.body // COLOCAR UM JOI

        await prisma.vestibulars.create({ // AS MATÉRIAS SERÃO CRIADAS EM UM CONTROLLER SEPARADO OU NESSE MESMO OU NESSA CHAMADA
            data: {
                name
            },
        });

        return res.status(201).send({ message: "Vestibular criado com sucesso" });
    },

    async update(req: Request, res: Response) {
        const { name } = req.body;
        const { id } = req.params;

        const vestibular = await prisma.vestibulars.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if(!vestibular) return res.status(400).send({ message: "Vestibular não encontrado"})

        await prisma.vestibulars.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name
            },
        });

        return res.status(201).send({ message: "Vestibular atualizado com sucesso" }); // MUDAR STATUS
    },

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const vestibular = await prisma.vestibulars.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if(!vestibular) return res.status(400).send({ message: "Vestibular não encontrado"});

        await prisma.vestibulars.delete({
            where: {
                id: parseInt(id)
            }
        })

        return res.status(201).send({ message: "Vestibular deletado com sucesso" }); // MUDAR STATUS
    },
}