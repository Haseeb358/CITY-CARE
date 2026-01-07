import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from "cors";
import cookieParser from "cookie-parser";
import DataBaseConnect from './utils/dbConnect.js'; 
import userRouter from './routes/user.router.js';
import ErrorHandler from './utils/globalErrorHandler.js';

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

//---------------- Routes-Router would go here
app.use("/api/user", userRouter);






//----------------
app.use(ErrorHandler)
let port = process.env.PORT || 8000;
let host = process.env.HOST || "localhost";

app.listen(port, host, () => {
  console.log(`Server is running at: http://${host}:${port} `);
});