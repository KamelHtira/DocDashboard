
import mongoose from "mongoose";
const usersSchema = mongoose.Schema(
    {
        username: {
            type:String,
            required:true,
            unique: true 
        },
        password: {
            type:String,
            required:true
        }
    }
)
const User = mongoose.models.User || mongoose.model('users',usersSchema)
export default User
