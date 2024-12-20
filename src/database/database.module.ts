import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill, Card, CardType, History, Payment, Role, User } from '../modules';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get<string>('db.host'),
          port: +configService.get<number>('db.port_db'),
          username: configService.get<string>('db.namedb'),
          password: configService.get<string>('db.password'),
          database: configService.get<string>('db.database'),
          entities: [User, Card, CardType, Bill, History, Role, Payment],
          synchronize: true,
          driver: require('mysql2')
        }
      },
      inject: [ConfigService]
    })
  ]
})
export class DatabaseModule {
}
