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


    async findAll() {
        return await this.subjectRepo.find()
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
