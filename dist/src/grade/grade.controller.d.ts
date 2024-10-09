import { GradeService } from './grade.service';
import { CreateGradeDTO } from './grade.dto';
export declare class GradeController {
    private gradeService;
    constructor(gradeService: GradeService);
    findAll(page: number): Promise<any>;
    findOneById(id: string): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    findOneByuserId(userId: string): Promise<any>;
    create(grade: CreateGradeDTO): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    update(id: string, updateData: Partial<CreateGradeDTO>): Promise<{
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
