import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'database.cec7j8tlq3ha.ap-northeast-2.rds.amazonaws.com',
    port: 3306,
    username: 'root',
    password: 'gkdnr8785!',
    database: 'database',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, // Only for develnpmopment. Set to false in production.
};

export default config;
