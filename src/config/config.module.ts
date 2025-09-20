import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validationSchema } from './config.schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
        '.env',
      ],
      validationSchema,
      validationOptions: { allowUnknown: true, abortEarly: false },
    }),
  ],
})
export class ConfigModule {}

