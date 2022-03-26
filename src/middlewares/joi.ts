import Joi from 'joi';
import validation from '../config/validation'
import { Request, Response, NextFunction } from "express";

type ReadingTypes = 'user' | 'discipline' | 'subject' | 'vestibular' | 'answer' | 'favorite' | 'ownVestibular';

export default (config: ReadingTypes) => (req: Request, res: Response, next: NextFunction) => {
    const sexo = validation[config]
    const schema = Joi.object(validation[config]).options({
        messages: validation.messages,
        abortEarly: false
    });

    const { error } = schema.validate(req.body) // E VALIDAR PARAMS TALVEZ? SO OS QUERY, POIS O PARAMS É OBRIGATORIO MESMO

    if(error) return res.status(400).send({ message: error.details.map(data => data.message).join('; ') });
     
    next()
}