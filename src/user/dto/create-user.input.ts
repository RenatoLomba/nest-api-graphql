import { InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsString({ message: 'Campo Nome deve ser do tipo texto' })
  @IsNotEmpty({ message: 'Campo Nome não pode estar vazio' })
  name: string;

  @IsEmail(
    { allow_ip_domain: false },
    { message: 'Campo E-mail deve ser um e-mail válido!' },
  )
  @IsNotEmpty({ message: 'Campo E-mail não pode estar vazio' })
  email: string;
}
