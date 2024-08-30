import { ProfileEntity } from "src/profile/profile.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SubjectsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: false })
    subject: string

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date

    @ManyToMany(() => ProfileEntity, (profile) => profile.subjects)
    @JoinTable({
        name: 'profile_subjects',
        joinColumn: {
            name: 'subject_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'profile_id',
            referencedColumnName: 'id'
        }
    })
    profiles: ProfileEntity[]
}