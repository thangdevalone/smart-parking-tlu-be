import { Module } from '@nestjs/common';
import { MainModule } from './modules';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { configuration } from './config';
import { DatabaseModule } from './database';
import { LoggerModule } from './logger';
import { AuthModule } from './auth';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    DatabaseModule,
    LoggerModule,
    MainModule,
    AuthModule
  ]
})
export class AppModule {
}
