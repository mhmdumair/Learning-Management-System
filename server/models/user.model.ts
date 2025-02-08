import mongoose,{Document,Model,Schema} from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const emailRegEx:RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document{
    name : string
    email : string
    password : string
    avatar : {
        public_id : string
        url : string
    }
    role :string
    isVerified : boolean
    courses :Array<{courseId : string}>
    comparePassword : (password : string) => Promise<boolean>
    SignAccessToken : () => string
    SignRefreshToken : () => string

}

const userSchema : Schema<IUser> = new mongoose.Schema({
    name : {
        type: String,
        required : [true,'Please enter your name']
    },
    email : {
        type:String,
        required : [true,'Please enter your Email'],
        validate : {
            validator : function (value :string){
                return emailRegEx.test(value)
            },
            message : "Please enter valid email"
        },
        unique : true
    },
    password : {
        type : String,
        required : [true,"Please provide your Email Address"],
        minlength : [6,"Password must be at least 6 characters"],
        select : false
    },
    avatar : {
        public_id : String,
        url :String
    },
    role : {
        type : String,
        default : "user"
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    courses : [
        {
            courseId : String,

        }
    ]
},{timestamps:true})


// Hash password before storing

userSchema.pre<IUser>('save',async function (next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
    next()
})

//compare password
userSchema.methods.comparePassword = async function(enteredPassword : string):Promise<boolean>{
    return await bcrypt.compare(enteredPassword,this.password)
}

// Sign Access Token
userSchema.methods.SignAccessToken = function(){
    return jwt.sign({id:this._id},process.env.ACCESS_TOKEN_SECRET as string)
}

//Sign Refresh Token
userSchema.methods.SignRefreshToken = function(){
    return jwt.sign({id:this._id},process.env.REFRESH_TOKEN_SECRET as string)
}

const useModel:Model<IUser> = mongoose.model("User",userSchema)
export default useModel
