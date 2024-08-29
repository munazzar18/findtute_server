import { GradeEntity } from "src/grade/grade.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ProfileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    first_name: string;

    @Column({ nullable: false })
    last_name: string;

    @Column({ nullable: false })
    cnic: string;

    @Column({ nullable: false })
    mobile: string;

    @Column({ type: "double precision", nullable: false })
    latitude: number;

    @Column({ type: 'double precision', nullable: false })
    longitude: number;

    @Column({ nullable: false })
    address: string;

    @Column({ nullable: false })
    avatar: string;

    @Column({ nullable: false })
    preference: string;

    @Column({ type: 'jsonb', nullable: false })
    education: Record<string, any>[]

    @Column({ type: 'jsonb', nullable: true })
    experience: Record<string, any>[]

    @Column({ nullable: true, default: false })
    is_active: boolean;

    @Column({ nullable: true, default: false })
    is_deleted: boolean;

    @Column({ nullable: true, default: false })
    is_verified: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @OneToOne(() => UserEntity, (user) => user.profile)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity

    @Column({ nullable: false })
    user_id: string

    @ManyToMany(() => GradeEntity, (grade) => grade.profiles)
    grades: GradeEntity[]


}