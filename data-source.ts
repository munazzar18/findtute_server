import { GradeEntity } from "src/grade/grade.entity";
import { SubjectsEntity } from "src/subjects/subjects.entity";
import { UserEntity } from "src/user/user.entity";
import { DataSource, DataSourceOptions } from "typeorm";

import { ConfigModule } from '@nestjs/config';
import { ApplicationEntity } from "src/application/application.entity";

ConfigModule.forRoot({
    envFilePath: ['.env', '.env.development', 'env.production']
})


export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.POSTGRES_URL || undefined,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [UserEntity, SubjectsEntity, GradeEntity, ApplicationEntity],
    migrationsTableName: "migrations",
    migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
    synchronize: false,
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource