import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import { DataSource } from 'typeorm';

const scrypt = promisify(scryptCallback);

@Injectable()
export class AuthService {
  constructor(private readonly dataSource: DataSource) {}

  async register(input: Record<string, unknown>) {
    const fullName = typeof input.name === 'string' ? input.name.trim() : '';
    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
    const phone = typeof input.phone === 'string' ? input.phone.trim() : '';
    const password = typeof input.password === 'string' ? input.password : '';

    if (fullName.length < 2 || fullName.length > 120 || !email || !phone || password.length < 8) {
      throw new BadRequestException('Vui lòng kiểm tra họ tên, email, số điện thoại và mật khẩu (ít nhất 8 ký tự).');
    }

    const salt = randomBytes(16).toString('hex');
    const key = (await scrypt(password, salt, 64)) as Buffer;
    const passwordHash = `scrypt$${salt}$${key.toString('hex')}`;

    try {
      const result = await this.dataSource.query(
        `INSERT INTO users (full_name, email, phone, password_hash, status)
         VALUES (?, ?, ?, ?, 'active')`,
        [fullName, email, phone, passwordHash],
      );
      return {
        message: 'Tạo tài khoản thành công.',
        user: { id: result.insertId, fullName, email, phone },
      };
    } catch (error) {
      if ((error as { code?: string })?.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email hoặc số điện thoại đã được đăng ký.');
      }
      throw error;
    }
  }
}
