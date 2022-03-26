import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() // INSTANCIAR PRISMA EM TODA APLICAÇÃO

export default {
    async get(req: Request, res: Response) {

        // console.log("Request", res.locals.id);
        const response = await prisma.questions.findMany({
            include: {
                question_subjects: true
            }
        });

        await prisma.$disconnect(); // USAR FINALLY // DESCONECTAR DEPOIS DE QUALQUER CONEXÃO

        return res.status(200).send(response);
    },

    async create(req: Request, res: Response) {
        const { alternatives, answer, disciplineId, vestibularId, subjectsId } = req.body // COLOCAR UM JOI

        // VALIDAR OS SUBJECT ID
        // EVITAR SUBJECT REPETIDO`
        // EVITAR QUE O SUBJECT ID SEJA DE OUTRA MATÉRIA
        
        await prisma.questions.create({
            data: {
                alternatives: JSON.stringify(alternatives),
                answer,
                question_subjects: {
                    createMany: {
                        data:  subjectsId.map((id: any) => id = { subject_id: parseInt(id) }) // OTIMA IDEIA
                    }
                },
                discipline_id: parseInt(disciplineId),
                vestibular_id: parseInt(vestibularId)
            },
        });
        
        console.log(subjectsId) // DE FATO RETORNA UM ARRAY, MELHOR QUE PEGAR VARIOS CAMPOS 

        await prisma.$disconnect();

        return res.status(201).send({ message: "Questão criada com sucesso" });
    },

    async update(req: Request, res: Response) {
        const { alternatives, answer, disciplineId, vestibularId, subjectsId } = req.body; // COLOCAR UM JOI
        const { id } = req.params;

        // VALIDAR SE discipline EXIST
        // PARA FACILITAR O PROCESSO DE CRIAR OS ASSUNTOS, TODO ASSUNTO ENVIADO SEMRPRE SERÁ UM ARRAY

        const question = await prisma.questions.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if(!question) return res.status(400).send({ message: "Matéria não encontrada"})
        	
        await prisma.questions.update({
            where: {
                id: parseInt(id)
            },
            data: {
                answer,
                alternatives: JSON.stringify(alternatives),
                discipline_id: parseInt(disciplineId),
                vestibular_id: parseInt(vestibularId)
                // question_subjects: { //PENDENTE
                //     updateMany: {
                //         where: {
                //             question_id: parseInt(id)
                //         },
                //         data: {
                //             subject_id: 2
                //         }
                //     }
                // }
            },
        })

        await prisma.$disconnect();

        return res.status(201).send({ message: "Matéria atualizada com sucesso" }); // MUDAR STATUS
    },

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        // VERIFICAR SE DELETA RELAÇÃO

        const question = await prisma.questions.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if(!question) return res.status(400).send({ message: "Questão não encontrada"});

        await prisma.questions.delete({
            where: {
                id: parseInt(id)
            }
        })

        await prisma.$disconnect();

        return res.status(201).send({ message: "Questão deletada com sucesso" }); // MUDAR STATUS
    },
}