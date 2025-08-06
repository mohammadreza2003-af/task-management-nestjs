import * as JOI from '@hapi/joi';

export const configValidationSchema = JOI.object({
  STAGE: JOI.string().required(),
  DB_HOST: JOI.string().required(),
  DB_DATABASE: JOI.string().required(),
  DB_USERNAME: JOI.string().required(),
  DB_PASSWORD: JOI.string().required(),
  DB_PORT: JOI.number().default(5432).required(),
  JWT_SECRET: JOI.string().required(),
});
