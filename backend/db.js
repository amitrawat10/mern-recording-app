const mongoose = require("mongoose");

function connectToDb() {
  mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.once("open", () =>
    console.log(`MongoDB connected to ${mongoose.connection.host}`)
  );
}

module.exports = connectToDb;
