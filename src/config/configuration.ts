import * as process from "process";

export const configuration = () => ({
  db: {
    host: process.env.HOST,
    port_db: process.env.PORT_DB,
    port: process.env.PORT,
    namedb: process.env.NAMEDB,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
  auth : {
    secret: process.env.SECRET,
    expiresIn: process.env.EXPIRESIN
  }
})