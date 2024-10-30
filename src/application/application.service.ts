import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationEntity } from './application.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateApplicationDto, StudentApplyDTO } from './application.dto';
import { serializedUser, UserEntity } from 'src/user/user.entity';
import { generateRandomString } from 'src/helpers/helpers';
import { compareToken } from 'src/auth/bcrypt';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectRepository(ApplicationEntity) private applicationRepo: Repository<ApplicationEntity>,
        private readonly chatService: ChatService
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

    async create(authUser: UserEntity) {

        const paymentHash = authUser.is_authorized;
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

        const serialUser = new serializedUser(authUser);

        const createApplication: DeepPartial<ApplicationEntity> = {
            preference: authUser.preference,
            grades: authUser.grades?.map(grade => grade.grade || grade.id),
            subjects: authUser.subjects?.map(subject => subject.subject || subject.id),
            user_id: authUser.id,
            avatar: authUser.avatar,
            hourly_rate: authUser.hourly_rate,
            monthly_rate: authUser.monthly_rate,
            lattitude: authUser.lattitude,
            longitude: authUser.longitude,
            teacher: serialUser,
            teacher_accepted: true,
            name: randName
        };

        const application = await this.applicationRepo.save(createApplication
        );

        return application;
    }


    async studentApplyOnApplication(authUser: UserEntity, applicationId: StudentApplyDTO) {
        const application = await this.findOneById(applicationId.application_id);
        if (!application) {
            throw new Error('Application not found');
        }
        application.student = authUser;
        application.student_accepted = true;
        application.teacher_accepted = true;
        await this.applicationRepo.update(applicationId.application_id, (application));

        const createChat = await this.chatService.findOrCreateChat(authUser.id, applicationId.application_id);

        if (!createChat) {
            throw new Error('Chat creation failed');
        }


        return application;

    }





}
