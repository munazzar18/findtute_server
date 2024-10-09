import { Repository } from 'typeorm';
import { GradeEntity } from './grade.entity';
import { CreateGradeDTO } from './grade.dto';
import { UserEntity } from 'src/user/user.entity';
export declare class GradeService {
    private gradeRepo;
    private UserRepo;
    constructor(gradeRepo: Repository<GradeEntity>, UserRepo: Repository<UserEntity>);
    findAll(page: number): Promise<any>;
    findOneById(id: string): Promise<any>;
    findOneByuserId(userId: string): Promise<any>;
    create(grade: CreateGradeDTO): Promise<any>;
    update(id: string, updateData: Partial<CreateGradeDTO>): Promise<any>;
    delete(id: string): Promise<any>;
}
