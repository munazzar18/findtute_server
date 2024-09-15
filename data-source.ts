import { DataSource, DataSourceOptions } from "typeorm";


export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.DB_URL || undefined,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrationsTableName: "migrations",
    migrations: [__dirname + '/**/*/migrations/*{.ts,.js}'],
    synchronize: false,
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource