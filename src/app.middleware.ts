import type {INestApplication} from '@nestjs/common';
import passport from 'passport';
import compression from "compression";

export function middleware(app: INestApplication): INestApplication {
  app.use(compression());
  app.use(passport.initialize());
  app.enableCors();
  return app;
}
