import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SubjectsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: false })
    subject: string

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date

    @ManyToMany(() => UserEntity, (user) => user.subjects)
    @JoinTable({
        name: 'user_subjects',
        joinColumn: {
            name: 'subject_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        }
    })
    users: UserEntity[]
}