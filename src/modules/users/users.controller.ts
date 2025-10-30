import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SafeUser } from './users.service'; // gunakan SafeUser dari service kamu

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* ---------- CREATE ---------- */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<SafeUser> {
    if (!createUserDto.password) {
      throw new BadRequestException('Password is required');
    }

    const user = await this.usersService.create(createUserDto);
    return user;
  }

  /* ---------- GET ALL ---------- */
  @Get()
  async findAll(): Promise<SafeUser[]> {
    return this.usersService.findAll();
  }

  /* ---------- GET BY ID ---------- */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SafeUser> {
    const userDoc = await this.usersService.findOne(id);
    if (!userDoc) throw new NotFoundException('User not found');

    const safe = this.usersService['toSafeUser'](userDoc);
    if (!safe) throw new NotFoundException('Failed to convert user');
    return safe;
  }

  /* ---------- UPDATE ---------- */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SafeUser> {
    const updated = await this.usersService.update(id, updateUserDto);
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  /* ---------- DELETE ---------- */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.usersService.remove(id);
    if (!deleted) throw new NotFoundException('User not found');
  }
}
