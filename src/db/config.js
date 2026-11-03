import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async() =>{
    
    const databaseURI = process.env.DATABASE_URL || "";
    
    if(!databaseURI.trim()) throw new Error("Database is not configured properly");

    await mongoose.connect(databaseURI);
}

export default connectDB;