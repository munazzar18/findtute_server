import { SubjectsEntity } from './subjects.entity';
import { Repository } from 'typeorm';
import { SubjectsDto } from './subjects.dto';
export declare class SubjectsService {
    private subjectRepo;
    constructor(subjectRepo: Repository<SubjectsEntity>);
    findAll(): Promise<SubjectsEntity[]>;
    findOneById(id: string): Promise<SubjectsEntity>;
    findOneBySubject(subject: string): Promise<SubjectsEntity>;
    create(data: SubjectsDto): Promise<any>;
    update(id: string, updateData: Partial<SubjectsDto>): Promise<any>;
    delete(id: string): Promise<any>;
}
