import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaService } from '../database/prisma.service';

@Controller({ path: '', version: VERSION_NEUTRAL })
export class HealthController {
  constructor(private health: HealthCheckService, private prisma: PrismaService) {}

  @Get('/health')
  @HealthCheck()
  check() {
    return this.health.check([
      async () => {
        await this.prisma.$queryRawUnsafe('SELECT 1');
        return { db: { status: 'up' } };
      },
    ]);
  }

  @Get('/readiness')
  @HealthCheck()
  readiness() {
    return this.health.check([
      async () => {
        await this.prisma.$queryRawUnsafe('SELECT 1');
        return { db: { status: 'up' } };
      },
    ]);
  }
}

