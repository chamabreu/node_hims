/* Imports */
import * as dotenv from 'dotenv'
import express from 'express';
import mongoose from 'mongoose';
import StoreRouter from './StoreRouter'
import SearchRouter from './SearchRouter'
import cors from 'cors'
dotenv.config()

/* App Config */
const app = express()
app.use(cors())
app.use(express.json())


/* MONGOOSE */
mongoose.connect(process.env.MONGODB, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(result => {
    console.log("Connected")
  })
  .catch(error => {
    console.log("error")
    console.log(error)
  })





/* Routes */
app.use('/store', StoreRouter)
app.use('/search', SearchRouter)


app.get('/', (req, res) => {
  res.send("GET Home Route")
})


app.post('/', (req, res) => {
  res.send("Hi from Post")
})


/* Port Listen */
app.listen(5000, () => {
  console.log("Server is running")
})


