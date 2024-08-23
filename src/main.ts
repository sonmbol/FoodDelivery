import * as dotenv from "dotenv"
dotenv.config()
import express from "express";
import { mysqlConnection, modifyQuery} from "./config/db";
const mobileRouter = require("./routes/mobile")

const app = express()

declare global { // to be acrosss the app
    interface CustomError extends Error {
        status: number
    }
    class Language {
        static isArabic: boolean
    }
}


app.use((err: CustomError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err) {
       res.status(err.status).send({ message: err.message }) 
    }

    res.status(500).send({ message: "Something went wrong!"})
})

const connect = async () => {
    mysqlConnection.ping()
    app.listen(process.env.PORT || 8080, () => console.log("app is up and runing on port 8080"))
    app.use(express.urlencoded( { 
        extended: true
    }))
    app.use(express.json())
    app.use('/api/mobile/usr', mobileRouter)
}

connect()

// Middleware 
app.use("/",(req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Language.isArabic = req.get('Accept-Language')?.toLowerCase() == "ar"
    next()
})

