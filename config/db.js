const mongoose = require("mongoose");

const DatabaseConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log(`Database Connect Success on host ${mongoose.connection.host}`);
  } catch (error) {
    console.log("Database Connect Error: " + error);
  }
};

module.exports = DatabaseConnect;
