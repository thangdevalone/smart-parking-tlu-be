import * as process from 'process';

export const configuration = () => ({
  db: {
    host: process.env.HOST,
    port_db: process.env.PORT_DB,
    port: process.env.PORT,
    namedb: process.env.NAMEDB,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  },
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.EXPIRESIN
    }
  },
  mail: {
    mail_app: process.env.EMAIL_APP,
    mail_app_password: process.env.EMAIL_APP_PASSWORD,
    mail_host: process.env.MAIL_HOST,
    mail_port: process.env.MAIL_PORT
  },
  service: {
    ai: process.env.SERVICE_AI
  },
  payment: {
    vnp: {
      tmnCode: process.env.VNP_TMNCODE,
      hashSecret: process.env.VNP_HASHSERRET,
      url: process.env.VNP_URL,
      returnUrl: process.env.RETURN_URL_VNP
    }
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});