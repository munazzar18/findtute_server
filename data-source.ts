import { GradeEntity } from "src/grade/grade.entity";
import { SubjectsEntity } from "src/subjects/subjects.entity";
import { UserEntity } from "src/user/user.entity";
import { DataSource, DataSourceOptions } from "typeorm";

import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
    envFilePath: ['.env', '.env.development', 'env.production']
})


export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.DB_URL || undefined,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [UserEntity, SubjectsEntity, GradeEntity],
    migrationsTableName: "migrations",
    migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
    synchronize: false,
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource