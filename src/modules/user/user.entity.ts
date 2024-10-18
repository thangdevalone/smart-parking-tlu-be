import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../role/role.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Unique(['phone'])
  @Column({ nullable: true })
  phone?: string;

  @Unique(['email'])
  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Unique(['userCode'])
  @Column()
  userCode: string;

  @ManyToOne(() => Role, role => role.id)
  role: Role;

  @Column(
    {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
    }
  )
  createdAt: Date;

  @Column(
    {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP'
    }
  )
  updatedAt: Date;

}
