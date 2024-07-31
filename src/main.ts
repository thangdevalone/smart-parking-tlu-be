import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {HttpException, HttpStatus, Logger as NestLogger, ValidationError, ValidationPipe} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {middleware} from "./app.middleware";
import {ResponseInterceptor} from "./handlers";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {json, urlencoded} from "express";

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


  const swaggerConfig = new DocumentBuilder()
    .setTitle("PARKING API")
    .setDescription("PARKING core apis for development")
    .addTag("PARKING")
    .addServer("http://localhost:3000", "Development API[PORT=3000]")
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: "Authorization",
        bearerFormat: "Bearer",
        scheme: "Bearer",
        type: "http",
        in: "Header"
      }
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true
  });
  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      uiConfig: {
        docExpansion: 'none'
      },
      docExpansion: 'none',
    },
  });

  app.use(json({limit: "10mb"}));
  app.use(urlencoded({extended: true, limit: "10mb"}));
  await app.listen(process.env.PORT || 3000);
  return app.getUrl();

}

void (async (): Promise<void> => {
  const url = await bootstrap();
  NestLogger.log(url, "Bootstrap");
})();