"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
const grade_entity_1 = require("./src/grade/grade.entity");
const subjects_entity_1 = require("./src/subjects/subjects.entity");
const user_entity_1 = require("./src/user/user.entity");
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const application_entity_1 = require("./src/application/application.entity");
config_1.ConfigModule.forRoot({
    envFilePath: ['.env', '.env.development', 'env.production']
});
exports.dataSourceOptions = {
    type: 'postgres',
    url: process.env.DB_URL || undefined,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [user_entity_1.UserEntity, subjects_entity_1.SubjectsEntity, grade_entity_1.GradeEntity, application_entity_1.ApplicationEntity],
    migrationsTableName: "migrations",
    migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
    synchronize: false,
};
const dataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
exports.default = dataSource;
//# sourceMappingURL=data-source.js.map