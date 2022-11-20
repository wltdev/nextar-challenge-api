import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  password: string

  @IsEmail()
  email: string

  permission?: string

  @IsNotEmpty()
  phone: string
}
