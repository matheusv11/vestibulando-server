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
        const { name, themeId } = req.body // COLOCAR UM JOI
        // TALVEZ O IDEAL SERIA APENAS UM ASSUNTO SER PERTENCE A UMA MATERIA

        // VALIDAR SE A MATERIA EXISTE

        const theme = await prisma.themes.findUnique({
            where: {
                id: parseInt(themeId)
            }
        });

        if(!theme) return res.status(400).send({ message: "Matéria não encotrada "});

        await prisma.subjects.create({
            data: {
                name,
                theme_id: parseInt(themeId) // OBRIGATORIO, MESMO TENDO ?, CHAVE ESTRANGEIRA
            }
        }); // PODE USAR UM CATCH DO PRISMA

        return res.status(201).send({ message: "Assunto criado com sucesso" });
    },

    async update(req: Request, res: Response) {
        const { name } = req.body; // COLOCAR UM JOI
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
                name
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