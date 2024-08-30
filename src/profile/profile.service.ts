import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from './profile.entity';
import { In, Repository } from 'typeorm';
import { ProfileDto } from './profile.dto';
import { UserEntity } from 'src/user/user.entity';
import { GradeEntity } from 'src/grade/grade.entity';
import { SubjectsEntity } from 'src/subjects/subjects.entity';

@Injectable()
export class ProfileService {

    constructor(
        @InjectRepository(ProfileEntity) private profileRepo: Repository<ProfileEntity>,
        @InjectRepository(GradeEntity) private gradeRepo: Repository<GradeEntity>,
        @InjectRepository(SubjectsEntity) private subjectsRepo: Repository<SubjectsEntity>

    ) { }

    async findAll() {
        try {
            return await this.profileRepo.find()
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async findOneById(id: string) {
        try {
            return await this.profileRepo.findOneBy({ id, is_deleted: false })
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async findOneByUserId(userId: string) {
        try {
            const profileById = await this.profileRepo.findOneBy({ user_id: userId, is_deleted: false })
            if (profileById && profileById !== null) {
                return profileById
            }
            else {
                return new NotFoundException('Profile not found')
            }

        } catch (error) {
            console.log(error)
            return error
        }
    }

    async create(data: ProfileDto, authUser: UserEntity) {
        const DeletedProfile = await this.profileRepo.findOneBy({ user_id: authUser.id, is_deleted: true });
        const ExistedProfile = await this.profileRepo.findOneBy({ user_id: authUser.id, is_deleted: false });

        const getGrades = await this.gradeRepo.find({
            where: {
                id: In(data.grades_ids)
            }
        })

        if (getGrades.length !== data.grades_ids.length) {
            throw new Error('Some grade IDs provided are invalid')
        }

        const getSubjects = await this.subjectsRepo.find({
            where: {
                id: In(data.subjects_ids)
            }
        })

        if (getSubjects.length !== data.subjects_ids.length) {
            throw new Error('Some subject IDs provided are invalid')
        }

        if (DeletedProfile) {
            try {
                const UpdateProfile = await this.updateDeleted(DeletedProfile.id, data, authUser)
                return UpdateProfile
            } catch (error) {
                console.log('Error updating deleted profile:', error);
                throw new Error('Failed to update the profile');
            }
        }

        if (ExistedProfile) {
            try {
                const UpdateProfile = await this.update(ExistedProfile.id, data, authUser)
                return UpdateProfile
            } catch (error) {
                console.log('Error updating profile:', error);
                throw new Error('Failed to update the profile');
            }
        }

        else {
            try {
                const profile = this.profileRepo.create({
                    ...data,
                    user_id: authUser.id,
                    grades: getGrades,
                    subjects: getSubjects
                });
                const savedProfile = await this.profileRepo.save(profile);
                return savedProfile
            } catch (error) {
                console.log('Error creating profile:', error);
                throw new Error('Failed to create the profile');
            }
        }


    }

    async update(id: string, updateData: Partial<ProfileDto>, authUser: UserEntity) {

        try {
            const profile = await this.profileRepo.findOneBy({ id, is_deleted: false });
            if (!profile) {
                throw new Error('Profile not found');
            }

            if (authUser.id !== profile.user_id) {
                throw new Error('You are not authorized to update this profile');
            }

            const updatedProfile = await this.profileRepo.save({
                ...profile,
                ...updateData,
            });
            return updatedProfile

        } catch (error) {
            console.log(error)
            return error
        }

    }

    async updateDeleted(id: string, data: ProfileDto, authUser: UserEntity) {

        try {
            const profile = await this.profileRepo.findOneBy({ id, is_deleted: true });
            if (!profile) {
                throw new Error('Profile not found');
            }

            if (authUser.id !== profile.user_id) {
                throw new Error('You are not authorized to update this profile');
            }

            const updatedProfile = await this.profileRepo.save({
                ...data,
                is_deleted: false
            });
            return updatedProfile

        } catch (error) {
            console.log(error)
            return error
        }
    }


    async delete(id: string, authUser: UserEntity) {
        const profile = await this.profileRepo.findOneBy({ id, is_deleted: false });

        if (!profile) {
            throw new Error('Profile not found');
        }

        if (authUser.id !== profile.user_id) {
            throw new Error('You are not authorized to delete this profile');
        }

        if (profile) {
            profile.is_deleted = true;
            await this.profileRepo.save(profile);
        } else {
            throw new Error('Profile not found');
        }
    }

}
