import mongoose from "mongoose";
import appConf from "../../config.json";

export default function () {
  mongoose.connect(
    appConf.mongoDbUrl,
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
