import { ProfileEntity } from "src/profile/profile.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class GradeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    grade: string


    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;


    @ManyToMany(() => ProfileEntity, (profile) => profile.grades)
    @JoinTable({
        name: 'profile_grade',
        joinColumn: {
            name: 'grade_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'profile_id',
            referencedColumnName: 'id'
        }
    })
    profiles: ProfileEntity[]
}