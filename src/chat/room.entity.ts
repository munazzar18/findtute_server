
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { ChatEntity } from './chat.entity';
import { serializedUser, UserEntity } from 'src/user/user.entity';
import { Transform } from 'class-transformer';

@Entity('rooms')
export class RoomEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string; // Room name (the other user's name)

    @ManyToOne(() => UserEntity, (user) => user.rooms)
    @Transform(({ value }) => new serializedUser(value)) // Apply the serializedUser transformation
    owner: serializedUser;

    @ManyToOne(() => UserEntity, (user) => user.rooms)
    @Transform(({ value }) => new serializedUser(value)) // Apply the serializedUser transformation
    other_user: serializedUser;

    @ManyToOne(() => ChatEntity, (chat) => chat.rooms)
    chat: ChatEntity;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date
}
