import mongoose from "mongoose";
import config from "config";


export default function () {
  mongoose.connect(
    config.get('mongoDbUrl'),
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
  );
  mongoose.Promise = global.Promise;
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
};
