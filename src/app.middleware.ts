import type { INestApplication } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from "express";

export function middleware(app: INestApplication): INestApplication {
  app.use(cookieParser());

  const options: CorsOptions = {
    origin: true, // Cho phép mọi nguồn gốc (bạn có thể chỉ định cụ thể hơn nếu cần)
    credentials: true
  };
  app.enableCors(options);

  const swaggerConfig = new DocumentBuilder()
    .setTitle("PARKING API")
    .setDescription("PARKING core apis for development")
    .addTag("PARKING")
    .addServer("http://localhost:8080", "Development API[PORT=8080]")
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
    },
  });

  // Middleware khác
  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ extended: true, limit: "10mb" }));

  return app;
}
