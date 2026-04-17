import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from "cors";
import cookieParser from "cookie-parser";
import DataBaseConnect from './utils/dbConnect.js'; 
import userRouter from './routes/user.router.js';
import ErrorHandler from './utils/globalErrorHandler.js';
import adminRouter from './routes/admin.router.js';
import complainantRouter from './routes/complainant.router.js';
import cityManagerRouter from './routes/cityManager.router.js';
import paymentRouter from './routes/payment.router.js';
import teamLeadRouter from './routes/teamLead.router.js';
const app = express();
//------------------------ Middlewares
dotenv.config();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
DataBaseConnect();
//------------------------ Cors Configuration
const allowedOrigins = [process.env.ALLOWED_ORIGIN];
const corsOptions = {
  origin: (origin, callback) => {
    console.log("Incoming request from origin: ", origin);
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allows cookies and authentication headers
};
app.use(cors(corsOptions));

import chatbotRouter from './routes/chatbot.router.js';

//---------------- Routes-Router would go here
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/complainant", complainantRouter);
app.use("/api/city-manager", cityManagerRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/chatbot', chatbotRouter);
app.use('/api/teamLead', teamLeadRouter)




//----------------
app.use(ErrorHandler)
let port = process.env.PORT || 8000;
let host = process.env.HOST || "localhost";

app.listen(port, host, () => {
  console.log(`Server is running at: http://${host}:${port} `);
});