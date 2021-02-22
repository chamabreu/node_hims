/* Imports */
import * as dotenv from 'dotenv'
import express from 'express';
import mongoose from 'mongoose';
import ReactRouter from './React/ReactRoutes'
import ApiRouter from './API/ApiRoutes'
import cors from 'cors'
import fs from 'fs';
import { MyError } from './Errorhandler'

/* Config dotenv to get the process.env stuff */
dotenv.config()



/* App Config */
const app = express()
app.use(cors())
app.use(express.json())





/* Routes */

/* API Routes */
app.use('/api', ApiRouter)



/* React Routes */
app.use('/', ReactRouter)


/* Errorhandler  */
app.use((error: MyError, req: express.Request, res: express.Response, next: express.NextFunction) => {

  console.log('AN ERROR: ', error)


  res.status(error.status)
  res.send(error)

})




/* START THE SERVER -- MOVE THIS IN A OWN FILE*/

/* CHECK MONGOOSE CONNECTION  */
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(async result => {
    console.log("Connected to DB.")

    /* if the DB is connected check if a media folder is available. */
    const mediaFolder = await createMediaFolder()
    if (mediaFolder) {
      console.log('Media folder exists.')
    } else {
      throw new Error("FAILED ON MEDIA FOLDER");
    }


    /* startup the server if everything is fine... Port Listen */
    app.listen(5000, () => {
      console.log("Server is running")
    })



  })
  .catch(error => {
    console.log(error)
    throw new Error('MONGOOSE CONNECITON FAILED');

  })


/* check if there is a media folder available and create recursivly */
async function createMediaFolder() {
  if (!fs.existsSync('media')) {
    try {
      fs.mkdirSync('media', { recursive: true })
      return true
    } catch (error) {
      return false
    }
  } else {
    return true
  }
}



