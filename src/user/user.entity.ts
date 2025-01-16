import { Role } from "src/roles/role.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { GradeEntity } from "src/grade/grade.entity";
import { SubjectsEntity } from "src/subjects/subjects.entity";
import { ApplicationEntity } from "src/application/application.entity";
import { ChatEntity } from "src/chat/chat.entity";
import { RoomEntity } from "src/chat/room.entity";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, default: "username" })
    username: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false, default: false })
    privacy_terms_conditions: boolean;

    @Column({ nullable: true })
    otp: string;

    @Column({ nullable: true, type: 'numeric', precision: 18, scale: 0 })
    expiry_otp: number;

    @Column({ type: 'enum', enum: Role, default: Role.Student })
    roles: Role;

    @Column({ nullable: false, default: false })
    email_verified: boolean;


    @Column({ nullable: true })
    first_name: string;

    @Column({ nullable: true })
    last_name: string;

    @Column({ nullable: true })
    cnic: string;

    @Column({ nullable: true })
    mobile: string;

    @Column({ type: "double precision", nullable: true })
    lattitude: number;

    @Column({ type: 'double precision', nullable: true })
    longitude: number;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    hourly_rate: number;

    @Column({ nullable: true })
    monthly_rate: number;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    preference: string;

    @Column({ type: 'jsonb', nullable: true })
    education: Record<string, any>[]

    @Column({ type: 'jsonb', nullable: true })
    experience: Record<string, any>[]

    @Column({ nullable: true, default: false })
    is_active: boolean;

    @Column({ nullable: true, default: false })
    is_deleted: boolean;

    @Column({ nullable: true, default: false })
    is_verified: boolean;

    @Column({ nullable: true, default: false })
    is_online: boolean;

    @Column({ nullable: true })
    is_authorized: string;

    @Column({ nullable: true })
    socketId: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @OneToMany(() => ApplicationEntity, (application) => application.teacher)
    create_application: ApplicationEntity[]

    @ManyToMany(() => GradeEntity, (grade) => grade.users, { cascade: true })
    grades: GradeEntity[]

    @ManyToMany(() => SubjectsEntity, (subject) => subject.users, { cascade: true })
    subjects: SubjectsEntity[]

    @OneToMany(() => ChatEntity, (chat) => chat.owner)
    chats: ChatEntity[];

    @OneToMany(() => RoomEntity, (room) => room.owner)
    rooms: RoomEntity[];

}


export class serializedUser {

    id: string;
    username: string;
    email: string;
    roles: Role;
    email_verified: boolean;
    first_name: string;
    last_name: string;
    cnic: string;
    mobile: string;
    lattitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
    hourly_rate: number;
    monthly_rate: number;
    avatar: string;
    preference: string;
    education: Record<string, any>[];
    experience: Record<string, any>[];
    is_active: boolean;
    is_deleted: boolean;
    is_verified: boolean;
    is_online: boolean;
    is_authorized: string;
    created_at: Date;
    updated_at: Date;
    create_application: ApplicationEntity[];
    grades: GradeEntity[];
    subjects: SubjectsEntity[];
    chats: ChatEntity[];
    rooms: RoomEntity[];
    socketId: string;


    @Exclude()
    password: string;
    @Exclude()
    otp: string;
    @Exclude()
    expiry_otp: number;

    constructor(partial: Partial<serializedUser>) {
        Object.assign(this, partial)
    }

}