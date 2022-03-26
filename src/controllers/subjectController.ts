import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() // INSTANCIAR PRISMA EM TODA APLICAÇÃO

export default {
    async get(req: Request, res: Response) {

        const response = await prisma.subjects.findMany(); //INCLUDE NA MATERIA
        
        await prisma.$disconnect(); // USAR FINALLY // DESCONECTAR DEPOIS DE QUALQUER CONEXÃO

        return res.status(200).send(response);
    },

    async create(req: Request, res: Response) { // COMPARAR COM RESPONDER ENEM
        const { name, disciplineId } = req.body
        // TALVEZ O IDEAL SERIA APENAS UM ASSUNTO SER PERTENCE A UMA MATERIA

        // VALIDAR SE A MATERIA EXISTE

        const discipline = await prisma.disciplines.findUnique({
            where: {
                id: parseInt(disciplineId)
            }
        });

        if(!discipline) return res.status(400).send({ message: "Matéria não encotrada "});

        await prisma.subjects.create({
            data: {
                name,
                discipline_id: parseInt(disciplineId) // OBRIGATORIO, MESMO TENDO ?, CHAVE ESTRANGEIRA
            }
        }); // PODE USAR UM CATCH DO PRISMA

        return res.status(201).send({ message: "Assunto criado com sucesso" });
    },

    async update(req: Request, res: Response) {
        const { name, disciplineId } = req.body; // NÃO DEVE SER OBRIGATÓRIO
        const { id } = req.params;

        const subject = await prisma.subjects.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if(!subject) return res.status(400).send({ message: "Assunto não encontrado"})

        await prisma.subjects.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                discipline_id: parseInt(disciplineId)
            },
        });

        return res.status(201).send({ message: "Assunto atualizado com sucesso" }); // MUDAR STATUS
    },

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const subject = await prisma.subjects.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if(!subject) return res.status(400).send({ message: "Assunto não encontrado"})

        await prisma.subjects.delete({
            where: {
                id: parseInt(id)
            }
        });

        return res.status(201).send({ message: "Assunto deletado com sucesso" }); // MUDAR STATUS
    },
}