import { ApplicationEntity } from './application.entity';
import { Repository } from 'typeorm';
import { CreateApplicationDto } from './application.dto';
import { UserEntity } from 'src/user/user.entity';
export declare class ApplicationService {
    private applicationRepo;
    constructor(applicationRepo: Repository<ApplicationEntity>);
    findAll(): Promise<ApplicationEntity[]>;
    findOneById(id: string): Promise<ApplicationEntity>;
    findOneByUserId(id: string): Promise<ApplicationEntity>;
    create(application: CreateApplicationDto, authUser: UserEntity): Promise<{
        name: string;
        hourly_rate: number;
        monthly_rate: number;
        avatar: string;
        preference: string;
        lattitude: number;
        longitude: number;
        grades: string[];
        subjects: string[];
        user_id: string;
    } & ApplicationEntity>;
}
