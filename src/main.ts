import { NestFactory } from '@nestjs/core';
import {AppModule} from './app.module';
import {HttpException, HttpStatus, Logger as NestLogger, ValidationError, ValidationPipe} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {middleware} from "./app.middleware";
import {ResponseInterceptor} from "./handlers";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  const config = app.get<ConfigService>(ConfigService);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      return new HttpException(Object.values(validationErrors[0].constraints)[0], HttpStatus.BAD_REQUEST);
    }
  }));

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableShutdownHooks();
  middleware(app);
  await app.listen(process.env.PORT || 3000);
  return app.getUrl();
}

void (async (): Promise<void> => {
  const url = await bootstrap();
  NestLogger.log(url, "Bootstrap");
})();