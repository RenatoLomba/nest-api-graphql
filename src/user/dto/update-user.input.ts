import { InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @IsString({ message: 'Campo Nome deve ser do tipo texto' })
  @IsNotEmpty({ message: 'Campo Nome não pode estar vazio' })
  @IsOptional()
  name?: string;

  @IsEmail(
    { allow_ip_domain: false },
    { message: 'Campo E-mail deve ser um e-mail válido!' },
  )
  @IsNotEmpty({ message: 'Campo E-mail não pode estar vazio' })
  @IsOptional()
  email?: string;
}
