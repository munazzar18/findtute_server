import { Role } from "src/roles/role.enum";
import { GradeEntity } from "src/grade/grade.entity";
import { SubjectsEntity } from "src/subjects/subjects.entity";
import { ApplicationEntity } from "src/application/application.entity";
export declare class UserEntity {
    id: string;
    username: string;
    email: string;
    password: string;
    otp: string;
    expiry_otp: number;
    roles: Role;
    email_verified: boolean;
    first_name: string;
    last_name: string;
    cnic: string;
    mobile: string;
    lattitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
    hourly_rate: number;
    monthly_rate: number;
    avatar: string;
    preference: string;
    education: Record<string, any>[];
    experience: Record<string, any>[];
    is_active: boolean;
    is_deleted: boolean;
    is_verified: boolean;
    is_online: boolean;
    is_authorized: string;
    created_at: Date;
    updated_at: Date;
    application: ApplicationEntity;
    grades: GradeEntity[];
    subjects: SubjectsEntity[];
}
export declare class serializedUser {
    password: string;
    otp: string;
    expiry_otp: number;
    constructor(partial: Partial<serializedUser>);
}
