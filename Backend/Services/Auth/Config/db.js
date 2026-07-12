import mongoose from "mongoose";

const connectDB = async () =>
{
  try {
    await mongoose.connect(process.env.MONGO_AUTH_URL);
    console.log(`ddatabase connected`);

  }
  catch(err)
  {
     console.log(`error in connecting:- ${err}`);
  }
}

export default connectDB;