import { SubjectsService } from './subjects.service';
import { SubjectsDto } from './subjects.dto';
export declare class SubjectsController {
    private subjectService;
    constructor(subjectService: SubjectsService);
    findAll(): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    findOneById(id: string): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    findOneBySubject(subject: string): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    create(data: SubjectsDto): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    update(id: string, updateData: Partial<SubjectsDto>): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    delete(id: string): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
}
