import bodyparser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import evaluate from "./api/evaluate";
import put from "./api/put";
import user from "./api/user";
import { backupDB } from "./db"
import { wrapAPI } from "./util";
dotenv.config();

const PORT = process.env.PORT || 4000
const url = process.env.MONGO_URL
const dbName = process.env.DBNAME

/**
 * Init mongodb connection and express server
 * @returns express app and mongoose connection object
 * 
 */
export function init() {
    return Promise.all([mongoose.connect(url!, { useNewUrlParser: true, useUnifiedTopology: true }), backupDB.$connect()])
        .then(([connection]) => {
            const app = express()
            app.use(express.static(`${__dirname}/../app/`))
            app.use(bodyparser.json())
            app.post("/api/put", wrapAPI(put))
            app.get("/api/evaluate", wrapAPI(evaluate))
            app.get("/api/user", wrapAPI(user))

            app.listen(PORT, () => console.log(`Started server on port: ${PORT}`))
            return {app, connection}
        })
}
