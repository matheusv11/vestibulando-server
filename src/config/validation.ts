import Joi from 'joi';

// PODERIA SER UMA CLASSE QUE RECEBE O JOI
// TIPAR OQUE FOR POSSIVEL

export default {
    user: {
        name:  Joi.string().min(3).max(60).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(26).required()
    },
    login: {
        email: Joi.string().email().required(),
        senha: Joi.string().required()
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