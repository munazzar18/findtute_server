import { PaymentEntity } from "src/payment/payment.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ApplicationEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: false })
    name: string

    @Column({ nullable: false })
    hourly_rate: number

    @Column({ nullable: false })
    monthly_rate: number

    @Column({ type: "double precision", nullable: false })
    lattitude: number

    @Column({ type: "double precision", nullable: false })
    longitude: number

    @Column({ nullable: false })
    avatar: string

    @Column({ nullable: false })
    preference: string

    @Column({ nullable: false, type: 'text', array: true })
    grades: string[]

    @Column({ nullable: false, type: 'text', array: true })
    subjects: string[]

    @Column()
    user_id: string

    @Column({ type: 'timestamptz', default: new Date() })
    expiry_date: Date

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @ManyToOne(() => UserEntity, (user) => user.create_application)
    teacher: UserEntity

    @ManyToOne(() => UserEntity)
    student: UserEntity

    @OneToMany(() => PaymentEntity, (payment) => payment.application)
    payments: PaymentEntity[];

    @Column({ default: false })
    teacher_accepted: boolean

    @Column({ default: false })
    student_accepted: boolean

}