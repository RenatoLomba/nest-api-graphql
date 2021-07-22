import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { User } from '../../user/user.entity';

@ObjectType()
export class AuthType {
  @Field(() => User)
  user: User;

  @Field(() => GraphQLString)
  token: string;
}
