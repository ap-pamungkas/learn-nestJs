import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/* ---------- Safe Type (tanpa password & properti Mongoose internal) ---------- */
export interface SafeUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /* ---------- CREATE ---------- */
  async create(dto: CreateUserDto): Promise<SafeUser> {
    if (!('password' in dto) || !dto.password) {
      throw new BadRequestException('Password is required');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const saved = await this.userModel.create({ ...dto, password: hashed });

    const safeUser = this.toSafeUser(saved);
    if (!safeUser) {
      throw new Error('Failed to convert user to SafeUser');
    }

    return safeUser;
  }

  /* ---------- FIND ALL ---------- */
  async findAll(): Promise<SafeUser[]> {
    const users = await this.userModel.find().lean().exec();
    return users
      .map((u) => this.toSafeUser(u))
      .filter((u): u is SafeUser => u !== null);
  }

  /* ---------- FIND ONE BY EMAIL ---------- */
  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /* ---------- FIND ONE BY ID ---------- */
  async findOne(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  /* ---------- UPDATE ---------- */
  async update(id: string, dto: UpdateUserDto): Promise<SafeUser | null> {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean()
      .exec();

    return updated ? this.toSafeUser(updated) : null;
  }

  /* ---------- REMOVE ---------- */
  async remove(id: string): Promise<boolean> {
    const res = await this.userModel.findByIdAndDelete(id).lean().exec();
    return !!res;
  }

  /* ---------- HELPER ---------- */
  private toSafeUser(
    doc: UserDocument | Record<string, unknown> | null,
  ): SafeUser | null {
    if (!doc) return null;

    const hasToObject = (
      value: unknown,
    ): value is { toObject: () => Record<string, unknown> } =>
      typeof value === 'object' && value !== null && 'toObject' in value;

    const raw: Record<string, unknown> = hasToObject(doc)
      ? doc.toObject()
      : (doc as Record<string, unknown>);

    // pastikan _id, dan konversi aman ke string
    const rawId = raw['_id'];
    const id =
      typeof rawId === 'string'
        ? rawId
        : typeof rawId === 'object' && rawId !== null && 'toString' in rawId
          ? (rawId as { toString: () => string }).toString()
          : '';

    // helper konversi aman ke string
    const toStringSafe = (value: unknown): string =>
      typeof value === 'string' ? value : '';

    const safeUser: SafeUser = {
      id,
      email: toStringSafe(raw['email']),
      name: toStringSafe(raw['name']),
      role: toStringSafe(raw['role']),
      createdAt:
        raw['createdAt'] instanceof Date ? raw['createdAt'] : new Date(),
      updatedAt:
        raw['updatedAt'] instanceof Date ? raw['updatedAt'] : new Date(),
    };

    return safeUser;
  }
}
