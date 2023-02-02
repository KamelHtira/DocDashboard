import mongoose from "mongoose";
mongoose.set('strictQuery', true);
const connectMongo = async() => mongoose.connect("mongodb+srv://kamel:kamel@cluster0.wejj0ir.mongodb.net/?retryWrites=true&w=majority")
export default connectMongo;
