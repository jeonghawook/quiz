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
              host: configService.get<string>('REDISHOST'),
              port: configService.get<number>('REDISPORT'),
            },
          ],
        };
      },
    }),
  ],
})
export class InMemoryModule {}
