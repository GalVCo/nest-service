import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().default(3000),
  LOG_LEVEL: Joi.string().default('debug'),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  DATABASE_URL: Joi.string().uri().required(),
});

