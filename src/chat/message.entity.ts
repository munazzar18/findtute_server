
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ChatEntity } from './chat.entity';
import { UserEntity } from 'src/user/user.entity';
import { MessageStatus } from './messageStatus.enum';


@Entity('messages')
export class MessageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @Column({ type: "enum", enum: [MessageStatus.Delivered, MessageStatus.Sent, MessageStatus.Seen], default: MessageStatus.Sent })
    status: MessageStatus

    @ManyToOne(() => ChatEntity, (chat) => chat.messages)
    chat: ChatEntity;

    @ManyToOne(() => UserEntity)
    sender: UserEntity;

    @ManyToOne(() => UserEntity)
    receiver: UserEntity;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date
}
