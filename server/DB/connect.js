import mongoose from 'mongoose';
 

const Connectdb= async()=>{
    try{
       await mongoose.connect("mongodb+srv://karthikeyanj:RkcW02zLD4vNBQqB@cluster0.lticywd.mongodb.net/Neokred")
        console.log("connected to Mongodb atlas")

    }
catch(error){
console.log("Mongo db is not connected")
}

}
 export default Connectdb