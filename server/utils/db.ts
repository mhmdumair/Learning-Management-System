import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const mongo_uri:string = process.env.MONGO_URI || ""

const connectDb = async ()=>{
    try{
        await mongoose.connect(mongo_uri).then((data:any)=>{
            console.log(`Database connected with ${data.connection.host}`);
            
        })
    }catch(err:any){
        console.log(err.message);
        setTimeout(connectDb,5000)
    }
}

export default connectDb