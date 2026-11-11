import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health/db')
  async checkDatabase() {
    try {
      const rows = await this.dataSource.query('SELECT DATABASE() AS name');
      return { status: 'ok', database: rows[0]?.name ?? null };
    } catch {
      throw new ServiceUnavailableException('Không kết nối được MySQL. Kiểm tra cấu hình be/.env và trạng thái MySQL.');
    }
  }
}
