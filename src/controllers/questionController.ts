import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() // INSTANCIAR PRISMA EM TODA APLICAÇÃO

export default {
    async get(req: Request, res: Response) {

        const { userId } = res.locals;

        const response = await prisma.questions.findMany({ // TIPAR RETORNO
            include: {
                discipline: true,
                vestibular: true,
                question_subjects: {
                    include: {
                        subject: true
                    }
                },
                favorite_questions: {
                    where: {
                        user_id: parseInt(userId) || 0 // NÃO CORRE RISCO DE VIR DADOS DO USUARIO NÃO LOGADO
                    }
                },
                answers: {
                    where: {
                        user_id: parseInt(userId) || 0 // APENAS RESPOSTA DO USUARIO LOGADO OU DE NINGUEM
                    }
                }
            }
        });

        await prisma.$disconnect(); // USAR FINALLY // DESCONECTAR DEPOIS DE QUALQUER CONEXÃO

        return res.status(200).send(response);
    },

    async create(req: Request, res: Response) {
        const { alternatives, title, answer, disciplineId, vestibularId, subjectsId } = req.body

        const discipline = await prisma.disciplines.findUnique({
            where: {
                id: parseInt(disciplineId)
            }
        });

        if(!discipline) return res.status(400).send({ message: "Matéria não encontrada" });

        const vestibular = await prisma.vestibulars.findUnique({
            where: {
                id: parseInt(vestibularId)
            }
        });

        if(!vestibular) return res.status(400).send({ message: "Vestibular não encontrado" });

        // VALIDAR SUBJECTS PELA DISCIPLINE

        const subjects = await prisma.subjects.findMany({ // OU FIND MANY, PARA VALIDAR O RESTANTE, USAR UM FILTER
            where: {
                id: {
                    in: subjectsId
                },
                discipline_id: parseInt(disciplineId)
            }
        });

        const notInSubjects = subjectsId.filter((e: any) => {
            return !subjects.find(sub => sub.id === e); // SE PROCURAR DIFERENTE, SEMPRE VAI TER, ENTÃO MELHOR NEGAR
        });

        if(notInSubjects[0]) return res.status(400).send({ message: `Os assuntos ${notInSubjects} não existem`});

        // PODE CADASTRAR COM ASSUNTO VAZIO?
        // EVITAR SUBJECT REPETIDO`
        // EVITAR QUE O SUBJECT ID SEJA DE OUTRA MATÉRIA
        
        await prisma.questions.create({
            data: {
                alternatives: JSON.stringify(alternatives), //TIPAR ALTERNATIVAS
                answer,
                title,
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
        const { alternatives, title, answer, disciplineId, vestibularId, subjectsId } = req.body;
        const { id } = req.params;

        // REGRA DE NEGOCIO, A DISCIPLINA TEM QUE SER PERTENCENTE AO VESTIBULAR // VAI SER INUTILIZADA AO MOMENTO
        // OS ASSUNTOS DEVEM SER DA MATERIA
        // VALIDAR SE discipline EXIST
        // LIMITAR O TANTO DE DADOS A SEREM ALTERADOS
        // PARA FACILITAR O PROCESSO DE CRIAR OS ASSUNTOS, TODO ASSUNTO ENVIADO SEMRPRE SERÁ UM ARRAY

        const question = await prisma.questions.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if(!question) return res.status(400).send({ message: "Questão não encontrada"})
        	
        const discipline = await prisma.disciplines.findUnique({
            where: {
                id: parseInt(disciplineId)
            }
        });

        if(!discipline) return res.status(400).send({ message: "Matéria não encontrada" });

        const vestibular = await prisma.vestibulars.findUnique({
            where: {
                id: parseInt(vestibularId)
            }
        });

        if(!vestibular) return res.status(400).send({ message: "Vestibular não encontrado" });

        await prisma.questions.update({
            where: {
                id: parseInt(id)
            },
            data: {
                answer,
                title,
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

        return res.status(201).send({ message: "Questão atualizada com sucesso" }); // MUDAR STATUS
    },

    async delete(req: Request, res: Response) {
        const { id } = req.params;

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
        });

        await prisma.$disconnect();

        return res.status(201).send({ message: "Questão deletada com sucesso" }); // MUDAR STATUS
    },
}