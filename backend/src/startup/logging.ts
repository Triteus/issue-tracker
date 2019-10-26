import winston from "winston";

import { MongoDBTransportInstance } from "winston-mongodb";

const { MongoDB }: { MongoDB: MongoDBTransportInstance } = require("winston-mongodb");

export default function() {
  //Exceptions outside of api-calls
  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" }),
    new winston.transports.Console({
    })
  );

  //standard logging on console
  winston.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );

  process.on("unhandledRejection", ex => {
    throw ex; //let winston handle it
  });

  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(
    new MongoDB({
      db: "mongodb://localhost/legends",
      level: "error"
    })
  );
};
