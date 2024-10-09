export declare class UpdateUserProfileDto {
    first_name: string;
    last_name: string;
    cnic: string;
    mobile: string;
    lattitude: number;
    longitude: number;
    address: string;
    avatar: string;
    preference: string;
    education: Record<string, any>[];
    experience: Record<string, any>[];
    grades_ids: string[];
    subjects_ids: string[];
}
