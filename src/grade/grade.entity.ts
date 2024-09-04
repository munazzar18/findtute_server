import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class GradeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    grade: string


    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;


    @ManyToMany(() => UserEntity, (user) => user.grades)
    @JoinTable({
        name: 'user_grade',
        joinColumn: {
            name: 'grade_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        }
    })
    users: UserEntity[]
}