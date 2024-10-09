import { UserEntity } from "src/user/user.entity";
export declare class SubjectsEntity {
    id: string;
    subject: string;
    created_at: Date;
    users: UserEntity[];
}
