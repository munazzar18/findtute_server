import { Role } from "src/roles/role.enum";
export declare class RegisterUserDto {
    username: string;
    email: string;
    password: string;
    roles: Role;
    first_name: string;
    last_name: string;
    cnic: string;
    mobile: string;
    latitude: number;
    longitude: number;
    address: string;
    avatar: string;
    preference: string;
    education: Record<string, any>[];
    experience: Record<string, any>[];
    grades_ids: string[];
    subjects_ids: string[];
    otp: string;
    expiry_otp: number;
}
