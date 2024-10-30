import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatEntity } from './chat.entity';
import { MessageEntity } from './message.entity';
import { RoomEntity } from './room.entity';
import { serializedUser, UserEntity } from 'src/user/user.entity';
import { ApplicationEntity } from 'src/application/application.entity';
import { Role } from 'src/roles/role.enum';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: Repository<ChatEntity>,

        @InjectRepository(MessageEntity)
        private messageRepository: Repository<MessageEntity>,

        @InjectRepository(RoomEntity)
        private roomRepository: Repository<RoomEntity>,

        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,

        @InjectRepository(ApplicationEntity)
        private applicationRepository: Repository<ApplicationEntity>,
    ) { }


    async findOrCreateChat(userId: string, applicationId: string): Promise<ChatEntity> {
        try {
            const studentUser = await this.userRepository.findOne({
                where: { id: userId },
                relations: ['rooms'],
            });

            if (!studentUser) {
                throw new NotFoundException('User not found');
            }

            const application = await this.applicationRepository.findOne({
                where: { id: applicationId },
                relations: ['teacher'],
            });
            if (!application) {
                throw new NotFoundException('Application not found');
            }

            const teacherUser = application.teacher;

            if (teacherUser.id === studentUser.id) {
                throw new NotFoundException('You cannot apply on your own application');
            }

            let chat = await this.chatRepository.findOne({
                where: { application: { id: applicationId } },
            });

            if (!chat) {
                chat = this.chatRepository.create({
                    application: application,
                    owner: teacherUser,
                    other_user: studentUser,
                });
                await this.chatRepository.save(chat);
            }


            const roomId = `${teacherUser.username}/${studentUser.username}`;

            let roomForCurrentUser = await this.roomRepository.findOne({
                where: {
                    name: roomId,
                    chat,
                },
            });

            if (!roomForCurrentUser) {

                roomForCurrentUser = this.roomRepository.create({
                    name: roomId,
                    owner: teacherUser,
                    other_user: studentUser,
                    chat,
                });
                await this.roomRepository.save(roomForCurrentUser);
            }

            return chat
        } catch (error) {
            throw new Error(`Failed to create chat: ${error.message}`);
        }
    }



    async saveMessage(chatId: string, senderId: string, content: string) {
        try {
            const chat = await this.chatRepository.findOne({
                where: {
                    id: chatId
                },
                relations: ['owner', 'other_user']

            })
            if (!chat) {
                throw new NotFoundException('Chat not found');
            }

            const msgSenderId = senderId;
            const msgReceiverId = chat.owner.id === senderId ? chat.other_user.id : chat.owner.id;

            const message = this.messageRepository.create({
                content,
                chat,
                sender: {
                    id: msgSenderId
                },
                receiver: {
                    id: msgReceiverId
                }
            })

            await this.messageRepository.save(message)
            return message

        } catch (error) {
            throw new Error(`Failed to save message: ${error}`);
        }
    }

    async getChatMessages(chatId: string) {
        try {

            const chat = await this.chatRepository.findOne({
                where: {
                    id: chatId
                },
                relations: ['owner', 'other_user',]
            })

            const owner = new serializedUser(chat.owner)
            const otherUser = new serializedUser(chat.other_user)

            const chatMessages = await this.messageRepository.find({
                where: {
                    chat: {
                        id: chatId
                    }
                },
                relations: ['sender', 'receiver'],
                order: {
                    created_at: 'ASC'
                }
            })
            return {
                owner,
                otherUser,
                messages: chatMessages
            }
        } catch (error) {
            throw new Error(`Failed to get chat messages: ${error}`);
        }
    }

    async getUserRooms(userId: string) {
        try {
            const rooms = await this.roomRepository.find({
                where:
                    [{ owner: { id: userId } }, { other_user: { id: userId } }]
                ,
                relations: ['chat', 'chat.application', 'owner', 'other_user']
            })

            return rooms
        } catch (error) {
            throw new Error(`Failed to get user rooms: ${error}`);
        }
    }

    async getRoomByChatId(chatId: string) {
        try {
            const rooms = await this.roomRepository.findOne({
                where: {
                    chat: {
                        id: chatId
                    }
                },
                relations: ['chat', 'chat.application', 'owner', 'other_user']
            })

            return rooms
        } catch (error) {
            throw new Error(`Failed to get user rooms: ${error}`);
        }
    }

}



