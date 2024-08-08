import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User,Card,CardType, Bill, History,Role} from '../modules'
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('db.host'),
        port: +configService.get<number>('db.port_db'),
        username: configService.get<string>('db.namedb'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.database'),
        entities: [User,Card,CardType, Bill, History,Role],
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
  ]
})
export class DatabaseModule { }
