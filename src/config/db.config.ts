import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    type: process.env.DB_TYPE ?? 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME ?? 'student',
    password: process.env.DB_PASSWORD ?? 'student',
    database: process.env.DB_DATABASE ?? 'nest_project',
    entities: [],
    synchronize: true,
  };
});
