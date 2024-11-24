import mongoose from "mongoose";

const db_conntion = async () => {
  try {
    const db_connect = await mongoose.connect(`${process.env.URI}/test_db`)
    console.log("db connection successful")

  } catch (error) {
    console.log(`db connection failed ${error.message}`);
    process.exit(1);
  }
};

export default db_conntion;
