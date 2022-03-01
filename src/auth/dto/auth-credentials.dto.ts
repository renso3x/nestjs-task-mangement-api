import { IsString, MinLength, MaxLength } from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
