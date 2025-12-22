import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/index.js';
import app from './app.js';



connectDB()
.then(()=>{
app.listen(process.env.PORT || 8000,()=>{
    console.log(`Server started on port ${process.env.PORT || 8000}`);
});
})
.catch((err)=>{
    console.error("Failed to connect to DB",err);
});