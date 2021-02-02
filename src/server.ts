/* Imports */
import * as dotenv from 'dotenv'
import express from 'express';
import mongoose from 'mongoose';
import StoreRouter from './StoreRouter'
import OnHoldRouter from './OnHoldRouter'
import cors from 'cors'

/* Config dotenv to get the process.env stuff */
dotenv.config()



/* App Config */
const app = express()
app.use(cors())
app.use(express.json())


/* MONGOOSE CONNECTION - outsource in own module */
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(result => {
    console.log("Connected")
  })
  .catch(error => {
    console.log("error")
    console.log(error)
  })





/* Routes */
/* Store route to handle store requests */
app.use('/store', StoreRouter)
app.use('/onhold', OnHoldRouter)




/* Home page of API - no Content */
app.get('/', (req, res) => {
  res.send("GET Home Route")
})





/* Port Listen */
app.listen(5000, () => {
  console.log("Server is running")
})


