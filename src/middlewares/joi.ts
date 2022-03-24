import Joi from 'joi';
import validation from '../config/validation'
import { Request, Response, NextFunction } from "express";

type ReadingTypes = 'user' | 'login';

export default (config: ReadingTypes) => (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object(validation[config]).options({
        messages: validation.messages,
        abortEarly: false
    });

    const { error } = schema.validate(req.body)

    if(error) return res.status(400).send({ message: error.details.map(data => data.message).join('; ') });
     
    next()
}