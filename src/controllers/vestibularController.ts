import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() // INSTANCIAR PRISMA EM TODA APLICAÇÃO

export default {
    async get(req: Request, res: Response) {

        const response = await prisma.vestibulars.findMany({
            include: {
                vestibular_disciplines: true
            }
        });
        
        await prisma.$disconnect();

        return res.status(200).send(response);
    },

    async create(req: Request, res: Response) {
        const { name } = req.body;

        const vestibular = await prisma.vestibulars.findFirst({
            where: {
                name
            }
        });

        if(vestibular) return res.status(400).send({ message: "Vestibular já criado"});

        await prisma.vestibulars.create({
            data: {
                name
            },
        });

        await prisma.$disconnect();

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

        await prisma.$disconnect();

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

        await prisma.$disconnect();

        return res.status(201).send({ message: "Vestibular deletado com sucesso" }); // MUDAR STATUS
    },
}