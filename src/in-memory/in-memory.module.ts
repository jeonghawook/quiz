import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';


@Module({
    imports: [
        RedisModule.forRoot({
            readyLog: true,
            config: [
                {
                    namespace: 'notValuable',
                    host: "redis-12799.c99.us-east-1-4.ec2.cloud.redislabs.com",
                    port: 12799
                    ,
                    password: "FU2QLrIy9r01vAzFcVFaqFpQGZF20asN"
                },
            ]
        })
    ]
})
export class InMemoryModule { }
