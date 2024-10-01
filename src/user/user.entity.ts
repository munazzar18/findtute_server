import { Role } from "src/roles/role.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { GradeEntity } from "src/grade/grade.entity";
import { SubjectsEntity } from "src/subjects/subjects.entity";
import { ApplicationEntity } from "src/application/application.entity";

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

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @OneToOne(() => ApplicationEntity, (application) => application.user)
    @JoinColumn()
    application: ApplicationEntity

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