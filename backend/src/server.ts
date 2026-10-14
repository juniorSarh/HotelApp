require("dotenv").config();

import { testConnection } from "./config/dbconfig"
import express, { Express, Request, Response, NextFunction } from "express";
import path from "path";
import { initUsersTable } from "./services/usersServices";
import userRoutes from "./routes/usersRoutes";

const app:Express = express();

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });

app.use(express.json());
app.use('/api/users', userRoutes);

// Serve static files from the "public" directory

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));



app.get("/", (req:Request, res:Response) => {

    res.sendFile(path.join(__dirname, 'views', 'index.html'));

});


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

  res.status(400).json({success:false, message:"Not found! try again"});

});


const startServer= async()=>{

    await testConnection();
    await initUsersTable()

    
    app.listen(process.env.PORT, () => {

        console.log(`Application is running on http://localhost:${process.env.PORT}`);  

        });

}   

export default startServer()