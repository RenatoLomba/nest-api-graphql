import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { HashPasswordTransform } from '../common/helper/crypto';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  name: string;

  @Column()
  @Unique('email', ['email'])
  email: string;

  @Column({
    transformer: new HashPasswordTransform(),
  })
  @HideField()
  password: string;
}
