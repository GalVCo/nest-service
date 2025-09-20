import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  author!: string;

  @ApiProperty({ description: 'ISBN-10/13' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 32)
  isbn!: string;

  @ApiProperty()
  @IsInt()
  pages!: number;
}

