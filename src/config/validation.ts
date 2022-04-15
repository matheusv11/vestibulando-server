import Joi from 'joi';

// PODERIA SER UMA CLASSE QUE RECEBE O JOI
// TIPAR OQUE FOR POSSIVEL

export default {
    user: {
        name:  Joi.string().min(3).max(60).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(26).required()
    },
    // login: {
    //     email: Joi.string().email().required(),
    //     password: Joi.string().required()
    // },
    discipline: {
        name:  Joi.string().min(3).max(60).required(),
    },
    subject: {
        name:  Joi.string().min(3).max(60).required(),
        disciplineId: Joi.number().required()
    },
    vestibular: {
        name:  Joi.string().min(3).max(60).required(),
    },
    comment: {
        name:  Joi.string().allow(), // APENAS PARA O TS NÃO RECLAMAR DEPOIS REMOVER
        comment: Joi.string().min(1).max(300).required(),
        questionId: Joi.number().required()
    },
    updateComment: {
        name:  Joi.string().allow(), // APENAS PARA O TS NÃO RECLAMAR DEPOIS REMOVER
        comment: Joi.string().min(1).max(300).required()
    },
    answer: {
        name:  Joi.string().allow(), // APENAS PARA O TS NÃO RECLAMAR DEPOIS REMOVER
        selected: Joi.string().min(1).max(2).required(),
        questionId: Joi.number().required()
    },
    updateAnswer: {
        name:  Joi.string().allow(), // APENAS PARA O TS NÃO RECLAMAR DEPOIS REMOVER
        selected: Joi.string().min(1).max(2).required()
    },
    favorite: {
        name:  Joi.string().allow(), // APENAS PARA O TS NÃO RECLAMAR DEPOIS REMOVER
        questionId: Joi.number().required()
    },
    question: {
        // alternatives: Joi.string().required(),
        // answer: Joi.string().required(),
        // disciplineId: Joi.number().required(),
        // vestibularId: Joi.number().required(),
        // subjectsId: Joi.array().required()
    },
    ownVestibular: {

    },
    messages: {
        "string.base": `{#key} precisar ser um 'texto'`,
        "string.empty": `{#key} não pode ser vazio`,
        "string.min": `{#key} deve ter no minimo {#limit} caracteres`,
        "string.max": `{#key} deve ter no maximo {#limit} caracteres`,
        "any.required": `Preencha o campo {#key}`,
        "string.length": `{#key} precisar ter {#limit} caracteres`,
        "string.pattern.base": `{#key} precisa conter somente números`,
        "string.email": `Insira um email válido no campo {#key}`
    }
}