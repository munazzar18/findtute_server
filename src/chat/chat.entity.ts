// chat.entity.ts
import { ApplicationEntity } from 'src/application/application.entity';
import { UserEntity } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MessageEntity } from './message.entity';
import { RoomEntity } from './room.entity';


@Entity('chats')
export class ChatEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, (user) => user.chats)
    owner: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.chats)
    other_user: UserEntity;

    @ManyToOne(() => ApplicationEntity)
    application: ApplicationEntity;

    @OneToMany(() => MessageEntity, (message) => message.chat)
    messages: MessageEntity[];

    @OneToMany(() => RoomEntity, (room) => room.chat)
    rooms: RoomEntity[];

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date
}
