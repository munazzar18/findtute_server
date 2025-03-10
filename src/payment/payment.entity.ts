import { ApplicationEntity } from "src/application/application.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PaymentStatus } from "./paymentStatus.enum";


@Entity()
export class PaymentEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: false })
    order_id: string

    @Column({ nullable: false })
    customer_name: string

    @Column({ nullable: false })
    transaction_id: string

    @Column({ nullable: false })
    amount: number

    @Column({ nullable: false, type: 'enum', enum: PaymentStatus, default: PaymentStatus.Pending })
    status: PaymentStatus

    @Column({ nullable: false })
    package: string

    @ManyToOne(() => UserEntity, (user) => user.payments)
    user: UserEntity

    @Column()
    user_id: string

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date

    @Column({ nullable: true })
    application_id: string

    @ManyToOne(() => ApplicationEntity, (application) => application.payments, { nullable: true, onDelete: 'SET NULL' })
    application: ApplicationEntity | null;


}