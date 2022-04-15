import Joi from 'joi';
import validation from '../config/validation'
import { Request, Response, NextFunction } from "express";

type ReadingTypes = 'user' | 'login' | 'discipline' | 'subject' | 'vestibular' | 'comment' | 'updateComment' | 'answer' | 'updateAnswer' | 'favorite' | 'question' | 'ownVestibular';

export default (config: ReadingTypes) => (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object(validation[config]).options({
        messages: validation.messages,
        abortEarly: false
    }).unknown(true); // UNKNOW É SOMENTE TEMPORARIO

    const { error } = schema.validate(req.body) // E VALIDAR PARAMS TALVEZ? SO OS QUERY, POIS O PARAMS É OBRIGATORIO MESMO

    if(error) return res.status(400).send({ message: error.details.map(data => data.message).join('; ') });
     
    next()
}