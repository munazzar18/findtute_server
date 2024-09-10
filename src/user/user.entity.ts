import { Role } from "src/roles/role.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { GradeEntity } from "src/grade/grade.entity";
import { SubjectsEntity } from "src/subjects/subjects.entity";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

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
    latitude: number;

    @Column({ type: 'double precision', nullable: true })
    longitude: number;

    @Column({ nullable: true })
    address: string;

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

    @Column({ nullable: true, default: false })
    is_Authorized: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @ManyToMany(() => GradeEntity, (grade) => grade.users, { cascade: true })
    grades: GradeEntity[]

    @ManyToMany(() => SubjectsEntity, (subject) => subject.users, { cascade: true })
    subjects: SubjectsEntity[]

}


export class serializedUser {

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