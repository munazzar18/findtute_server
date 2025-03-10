import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectsEntity } from './subjects.entity';
import { Repository } from 'typeorm';
import { SubjectsDto } from './subjects.dto';

@Injectable()
export class SubjectsService {
    constructor(
        @InjectRepository(SubjectsEntity) private subjectRepo: Repository<SubjectsEntity>
    ) { }

    async getAllSubjects() {
        return await this.subjectRepo.find()
    }


    async findAll(page: number) {
        const limit: number = 10;
        const skip: number = (page - 1) * limit
        try {
            const [subjects, total] = await this.subjectRepo.findAndCount({
                order: {
                    id: 'ASC'
                },
                skip: skip,
                take: (page * limit)
            })
            const totalPages = Math.ceil(total / limit)

            return {
                data: subjects,
                pageData: {
                    total,
                    perPage: limit,
                    currentPage: Number(page),
                    lastPage: totalPages
                }
            }

        } catch (error) {
            console.log(error)
            return error
        }
    }


    async findOneById(id: string) {
        return await this.subjectRepo.findOneBy({ id })
    }


    async findOneBySubject(subject: string) {
        return await this.subjectRepo.findOneBy({ subject })
    }


    async create(data: SubjectsDto) {
        try {
            const createSubject = this.subjectRepo.create({
                ...data
            })
            const savedSubject = await this.subjectRepo.save(createSubject)
            return savedSubject
        } catch (error) {
            console.log(error)
            return error
        }
    }


    async update(id: string, updateData: Partial<SubjectsDto>) {
        try {
            const subject = await this.subjectRepo.findOne({
                where: { id }
            })

            if (!subject) {
                return new Error('Subject not found')
            }

            const updatedSubject = await this.subjectRepo.save({
                ...subject,
                ...updateData
            })
            return updatedSubject
        } catch (error) {
            console.log(error)
            return error
        }
    }



    async delete(id: string) {
        try {
            const subject = await this.subjectRepo.findOne({
                where: { id }
            })

            if (!subject) {
                return new Error('Subject not found')
            }

            const deletedSubject = await this.subjectRepo.remove(subject)

            return deletedSubject
        } catch (error) {
            console.log(error)
            return error
        }
    }

}
