import {Module} from '@nestjs/common';
import {MainModule} from './modules'
import {ConfigModule} from '@nestjs/config';
import {EventEmitterModule} from '@nestjs/event-emitter';

@Module({
  imports: [MainModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      // load: [configuration],
    }),]
})
export class AppModule {
}
