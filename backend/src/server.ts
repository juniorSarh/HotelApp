import dotenv from 'dotenv'
import { env } from 'node:process'
const express = require('express')

dotenv.config()
const app = express()

const PORT = (process.env.PORT)


app.listen(PORT,()=>
{
    console.log(`server is runnning at http://localhost:${PORT}`)
})