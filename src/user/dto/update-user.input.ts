import { InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

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

  @IsString({ message: 'Campo Senha deve ser do tipo texto' })
  @IsNotEmpty({ message: 'Campo Senha não pode estar vazio' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 digitos' })
  @IsOptional()
  password?: string;
}
