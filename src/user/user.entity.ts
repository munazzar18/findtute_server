import { Role } from "src/roles/role.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { ProfileEntity } from "src/profile/profile.entity";
import { Course } from "src/courses/course.entity";


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

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @OneToOne(() => ProfileEntity, (profile) => profile.user_id)
    @JoinColumn({ name: 'profile' })
    profile: ProfileEntity

    @OneToMany(() => Course, (course) => course.user_id)
    @JoinColumn({ name: 'courses' })
    courses: Course[]
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