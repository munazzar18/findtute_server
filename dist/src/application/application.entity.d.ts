import { UserEntity } from "src/user/user.entity";
export declare class ApplicationEntity {
    id: string;
    name: string;
    hourly_rate: number;
    monthly_rate: number;
    lattitude: number;
    longitude: number;
    avatar: string;
    preference: string;
    grades: string[];
    subjects: string[];
    user_id: string;
    created_at: Date;
    updated_at: Date;
    user: UserEntity;
}
