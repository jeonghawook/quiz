import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RedisModuleOptions => {
        return {
          readyLog: true,
          config: [
            {
              namespace: 'notValuable',
              host: 'redis-12577.c57.us-east-1-4.ec2.redns.redis-cloud.com',
              port: 12577,
              password: '12345',
            },
          ],
        };
      },
    }),
  ],
})
export class InMemoryModule {}
