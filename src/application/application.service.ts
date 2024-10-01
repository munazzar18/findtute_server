import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationEntity } from './application.entity';
import { Repository } from 'typeorm';
import { CreateApplicationDto } from './application.dto';
import { UserEntity } from 'src/user/user.entity';
import { generateRandomString } from 'src/helpers/helpers';
import { compareToken } from 'src/auth/bcrypt';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectRepository(ApplicationEntity) private applicationRepo: Repository<ApplicationEntity>
    ) { }


    async findAll() {
        return await this.applicationRepo.find()

    }

    async findOneById(id: string) {
        return await this.applicationRepo.findOneBy({ id })

    }

    async findOneByUserId(id: string) {
        return await this.applicationRepo.findOneBy({ user_id: id })
    }

    async create(application: CreateApplicationDto, authUser: UserEntity) {
        const user = await this.findOneByUserId(authUser.id);

        if (!user) {
            throw new Error('User not found');
        }

        const paymentHash = authUser.is_authorized
        const token = authUser.first_name + authUser.last_name + authUser.email + authUser.id;
        const isTokenValid = compareToken(token, paymentHash);

        if (!isTokenValid) {
            throw new Error('Invalid payment token');
        }

        let randName: string;
        let isUnique = false;


        while (!isUnique) {
            randName = generateRandomString(17);
            const appExists = await this.applicationRepo.findOne({ where: { name: randName } });

            if (!appExists) {
                isUnique = true;
            }
        }

        return await this.applicationRepo.save({
            name: randName,
            preference: authUser.preference,
            grades: authUser.grades,
            subjects: authUser.subjects,
            user_id: authUser.id,
            avatar: authUser.avatar,
            hourly_rate: authUser.hourly_rate,
            monthly_rate: authUser.monthly_rate,
            lattitude: authUser.lattitude,
            longitude: authUser.longitude,
            ...application
        });
    }





}
