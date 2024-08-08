import { BaseEntity, Column, OneToMany, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { User } from '../user'

@Entity('roles')
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @OneToMany(() => User, user => user.role)
    users: User[];

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