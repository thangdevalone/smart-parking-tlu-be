import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, Logger as NestLogger, ValidationError, ValidationPipe } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { middleware } from "./app.middleware";
import { ResponseInterceptor } from "./handlers";
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
  const config = app.get<ConfigService>(ConfigService);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      return new HttpException(Object.values(validationErrors[0].constraints)[0], HttpStatus.BAD_REQUEST);
    }
  }));

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Đường dẫn này sẽ được sử dụng trong URL để truy cập tệp
  });

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