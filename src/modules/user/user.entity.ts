import { BaseEntity, Column, ManyToOne, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'
import { Exclude, Expose } from 'class-transformer'
import { Role } from '../role'

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    fullName: string

    @Column()
    phone: string

    @Unique(['email'])
    @Column()
    email: string

    @Exclude()
    @Column()
    password: string

    @Unique(['userCode'])
    @Column()
    userCode: string

    @ManyToOne(() => Role, role => role.users)
    role: Role;

    @Column(
        {
          type: 'timestamp',
          default: () => 'CURRENT_TIMESTAMP',
        },
      )
      createAt: Date;
    
      @Column(
        {
          type: 'timestamp',
          default: () => 'CURRENT_TIMESTAMP',
          onUpdate: 'CURRENT_TIMESTAMP',
        },
      )
      updateAt: Date;

}