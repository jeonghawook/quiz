import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';


@Module({
    imports: [
        RedisModule.forRoot({
            readyLog: true,
            config: [
                {
                    namespace: 'notValuable',
                    host: "redis-18535.c267.us-east-1-4.ec2.cloud.redislabs.com",
                    port: 18535,
                    password: "KbFBdma9QCj0zuwcQkGcPRVPWh0467jX"
                },
            ]
        })
    ]
})
export class InMemoryModule { }
