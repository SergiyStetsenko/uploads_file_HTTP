const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const AuthRouter = require("../routes/auth.routes");
const InfoRoutes = require("../routes/info.routes");

const app = express();
dotenv.config({ path: path.join(__dirname, "../.env") });
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ extended: true }));
app.use("/api/auth", AuthRouter);
app.use("/api", InfoRoutes);
app.use("*", (req, res, next) => {
  res.status(404).json({ message: `Path ${req.originalUrl} not found!` });
  next();
});

const optMongo = {
  promiseLibrary: global.Promise,
  poolSize: 50,
  keepAlive: 30000,
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,

  autoIndex: false,
};

async function start() {
  try {
    const { MONGO_URI } = process.env;
    // console.log("MONGO_URI",MONGO_URI)
    await mongoose.connect(MONGO_URI, optMongo, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });

    app.listen(PORT, () => {
      console.log(`Server started on Port ${PORT}.....`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
start();
