import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { GradeEntity } from 'src/grade/grade.entity';
import { SubjectsEntity } from 'src/subjects/subjects.entity';
export declare class DashboardService {
    private userRepo;
    private gradeRepo;
    private subjectRepo;
    constructor(userRepo: Repository<UserEntity>, gradeRepo: Repository<GradeEntity>, subjectRepo: Repository<SubjectsEntity>);
    dashboard(): Promise<{
        usersCount: number;
        teachersCount: number;
        studentsCount: number;
        parentsCount: number;
        gradesCount: number;
        subjectsCount: number;
    }>;
}
