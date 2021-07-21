module.exports = {
  type: process.env.DATABASE_TYPE || 'postgres',
  host: process.env.DATABASE_HOST || '0.0.0.0',
  port: +process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_DB || 'nest_api_graphql',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};
