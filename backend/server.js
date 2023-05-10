const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });
require("./database/database");

//uncaught error
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log("sutting down the server due to unhandled promice rejection");
  process.exit(1);
});

const server = app.listen(process.env.PORT, () => {
  console.log(`server is listening at port no ${process.env.PORT}...`);
});

//unhandled promice rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log("sutting down the server due to unhandled promice rejection");
  server.close(() => {
    process.exit(1);
  });
});
