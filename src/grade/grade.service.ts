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


    async create(grade: CreateGradeDTO, authUser: UserEntity) {
        try {
            const profile = await this.profileRepo.findOneBy({ id: authUser.profile.id })

            if (!profile) {
                return new Error('Profile not found')
            }

            const createGrade = this.gradeRepo.create({
                ...grade,
                profiles: [profile]
            })
            const savedGrade = await this.gradeRepo.save(createGrade)
            return savedGrade
        } catch (error) {
            console.log(error)
            return error
        }
    }


    async update(id: string, updateData: Partial<CreateGradeDTO>, authUser: UserEntity) {
        try {
            const grade = await this.gradeRepo.findOne({
                where: {
                    id
                },
                relations: {
                    profiles: true
                }
            })

            if (!grade) {
                return new Error('Grade not found')
            }

            const profile = grade.profiles.find(profile => profile.id === authUser.profile.id)

            if (!profile) {
                return new Error('You are not authorized to update this grade')
            }

            if (updateData.profile_id) {
                const exsistedProfile = await this.profileRepo.findOne({
                    where: {
                        id: updateData.profile_id
                    }
                })

                if (exsistedProfile) {
                    grade.profiles = [exsistedProfile]
                }
            }

            Object.assign(grade, updateData)

            const updateGrade = await this.gradeRepo.save(grade)

            return updateGrade
        } catch (error) {
            console.log(error)
            return error
        }
    }


    async delete(id: string, authUser: UserEntity) {

        try {
            const grade = await this.gradeRepo.findOne({
                where: { id },
                relations: ['profiles']
            });

            if (!grade) {
                return new Error('Grade not found')
            }

            const isAuthorized = grade.profiles.some(profile => profile.id === authUser.profile.id)

            if (!isAuthorized) {
                return new Error('You are not authorized to delete this grade')
            }

            return await this.gradeRepo.delete(grade)
        } catch (error) {
            console.log(error)
            return error
        }
    }


}
