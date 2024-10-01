import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { In, Repository } from 'typeorm';
import { GradeEntity } from 'src/grade/grade.entity';
import { SubjectsEntity } from 'src/subjects/subjects.entity';

@Injectable()
export class DashboardService {

    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        @InjectRepository(GradeEntity) private gradeRepo: Repository<GradeEntity>,
        @InjectRepository(SubjectsEntity) private subjectRepo: Repository<SubjectsEntity>
    ) { }


    async dashboard() {
        const users = await this.userRepo.find();
        const usersCount = users.length;

        const teachers = users.filter(user => user.roles === 'teacher');
        const teachersCount = teachers.length;

        const students = users.filter(user => user.roles === 'student');
        const studentsCount = students.length;

        const parents = users.filter(user => user.roles === 'parent');
        const parentsCount = parents.length;

        const grades = await this.gradeRepo.find();
        const gradesCount = grades.length;

        const subjects = await this.subjectRepo.find();
        const subjectsCount = subjects.length;

        return {
            usersCount,
            teachersCount,
            studentsCount,
            parentsCount,
            gradesCount,
            subjectsCount
        }

    }

}
