require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");


const app = express();

app.use(cors({origin:process.env.CLIENT_URL}));
app.use(express.json());

app.use("/api/auth",authRoutes);


const PORT = process.env.PORT || 4000;


app.listen(PORT,()=>{
    console.log(`Server is Running on port ${PORT}`);
    
})