import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GradeEntity } from './grade.entity';
import { CreateGradeDTO } from './grade.dto';
import { UserEntity } from 'src/user/user.entity';
import { ProfileEntity } from 'src/profile/profile.entity';

@Injectable()
export class GradeService {

    constructor(
        @InjectRepository(GradeEntity) private gradeRepo: Repository<GradeEntity>,
        @InjectRepository(ProfileEntity) private profileRepo: Repository<ProfileEntity>
    ) { }

    async findAll() {
        try {
            return await this.gradeRepo.find()
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async findOneById(id: string) {
        try {
            return await this.gradeRepo.findOneBy({ id })
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async findOneByProfileId(profileId: string) {
        try {
            return await this.gradeRepo.findOneBy({ id: profileId })
        } catch (error) {
            console.log(error)
            return error
        }
    }


    async create(grade: CreateGradeDTO) {
        try {
            const createGrade = this.gradeRepo.create({
                ...grade,
            })
            const savedGrade = await this.gradeRepo.save(createGrade)
            return savedGrade
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async update(id: string, updateData: Partial<CreateGradeDTO>) {
        try {
            const grade = await this.gradeRepo.findOne({
                where: {
                    id
                }
            });

            if (!grade) {
                return new Error('Grade not found');
            }

            Object.assign(grade, updateData);

            const updatedGrade = await this.gradeRepo.save(grade);

            return updatedGrade;
        } catch (error) {
            console.log(error);
            return error;
        }
    }


    async delete(id: string) {
        try {
            const grade = await this.gradeRepo.findOne({ where: { id } });

            if (!grade) {
                return new Error('Grade not found');
            }

            await this.gradeRepo.delete(id);

            return { message: 'Grade deleted successfully' };
        } catch (error) {
            console.error(error);
            return error;
        }
    }



}
