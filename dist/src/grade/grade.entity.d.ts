import { UserEntity } from "src/user/user.entity";
export declare class GradeEntity {
    id: string;
    grade: string;
    created_at: Date;
    users: UserEntity[];
}
