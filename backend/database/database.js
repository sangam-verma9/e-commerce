const mongoose = require("mongoose");
// mongoose.set('strictQuery',false);

mongoose.connect(process.env.db_uri).then(() => {
  console.log("db connect successfully..");
});

//   .catch((err) => {
//     console.log(err);
//   });
