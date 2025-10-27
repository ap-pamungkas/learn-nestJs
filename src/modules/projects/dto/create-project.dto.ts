import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateProjectDto {
  // name & description: Wajib ada dan tidak boleh kosong
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  // projectUrl & imageUrl: Opsional (Nullable), tapi harus format URL jika diisi
  @IsOptional()
  @IsUrl()
  readonly url: string;

  @IsOptional()
  @IsUrl()
  readonly image: string;
}
