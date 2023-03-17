import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(
      `MongoDB connected: ${conn.connection.host}`.bold.cyan.underline
    );
  } catch (error) {
    console.error(`Error: ${error.message}`.bold.red);
    process.exit(1);
  }
};

export default connectDB;
