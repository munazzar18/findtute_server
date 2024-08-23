import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Course {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'jsonb', nullable: false })
    course: Record<string, any>[]

    @Column({ type: 'jsonb', nullable: true })
    grade: Record<string, any>[]

    @ManyToOne(() => UserEntity, (user) => user.courses)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity

    @Column()
    user_id: string

}
