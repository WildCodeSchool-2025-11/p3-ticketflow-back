import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import router from "./router.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use("/uploads", express.static("uploads"));

// Routes
app.use(router);

export default app;
