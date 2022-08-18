const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');

//Routes
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, 
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    () => {
        console.log("connected to DB")
    });

//Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
    console.log(`Server Started At Port ${PORT}`);
});