import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { MyError } from '../../Errorhandler';
import MBulkSolid from '../../Models/MBulkSolid';
import MBulkSolidCounter from '../../Models/MBulkSolidCounter';
import MRack from '../../Models/MRack';
import { BulkSolidCreateMW } from './BulkSolidCreateMW';

const bulkSolidRouter = express()



/* MULTER CONFIG */
/* create a storage config for multer. this is to save files correctly */
const storage = multer.diskStorage({
  /* set the destination of the files uploaded */
  destination: function (req, file, cb) {
    cb(null, './media/')
  }
})

/* create a multer instance to use it as middleware */
const bulkSolidPicture = multer({ storage: storage })





/* GET */



/* get the countervalue for a new bulk solid ID */
bulkSolidRouter.get("/getnewid", (req, res, next) => {
  /* find bulksolidcounter */
  MBulkSolidCounter.findById("bulksolidcounter", {}, {}, (error, data) => {
    /* if error  */
    if (error) {
      console.log("")
      console.log("GET - NEWBULKSOLIDID -- ERROR")
      console.log(error)
      console.log("--------------------")
      console.log("")
      const apiError = new MyError(error.message, 500)
      next(apiError)
    }

    /* else send latest counter value */
    console.log("")
    console.log("GET - NEWBULKSOLIDID -- countervalue")
    console.log(data.counterValue)
    console.log("--------------------")
    console.log("")
    res.send({ counterValue: data.counterValue })
  })
})




/* POST */


/* bulksolid storage */
bulkSolidRouter.post(
  /* route */
  '/create',

  /* Middleware for multer */
  bulkSolidPicture.fields(
    [
      { name: 'bulkSolidPicture' },
      { name: 'msdsFile' }
    ]
  ),

  /* Middleware to store the data */
  BulkSolidCreateMW
)




/* PUT */




/* drag drop handler to update rackFields and bulksolid.storedAt[] */
bulkSolidRouter.put('/storedat', async (req, res, next) => {

  /* Get the itemID, fieldID and the rackName to handle the item transition */
  const {
    sourceItemID,
    targetFieldID,
    currentRackName
  }:
    {
      sourceItemID: number,
      targetFieldID: string,
      currentRackName: string
    } = req.body



  /* The Session to start a transaction. This helps on reverting single changes if one action fails */
  const moveBulkSolidSession = await mongoose.startSession()
  moveBulkSolidSession.startTransaction()


  /* try catch block for the transaction. because we use await, we can catch all errors at once */
  try {
    /* update first the array in the MBulkSolid object. */
    const updatedBulkSolid = await MBulkSolid.findOneAndUpdate(
      /* Query */
      {
        /* find the right item */
        bulkSolidID: sourceItemID,

        /* and check that it does not already exist in the target location */
        storedAt: { $ne: targetFieldID }
      },

      /* UPDATE TASKS */
      {
        /*
          change its onHold state to false to make it disappear in the onhold area.
          need to be implemented in frontend to handle this dynamically.
          for now keep onHold at true, to make it not disappear in frontend onHoldArea
        */
        onHold: true,

        /* change the storedAt array to contain the target fieldID */
        $push: { storedAt: targetFieldID }
      },

      /* OPTIONS */
      {
        /* return new bulkSolid*/
        returnOriginal: false,

        /* attach it to session */
        session: moveBulkSolidSession
      })



    /* If the new bulkSolid is null, throw an error.
    this could be caused because the user tried to set a bulk into a field which already contains stuff.
    Can never be the case because the frontend rejects such request - but who knows.
    */
    if (!updatedBulkSolid) {
      throw new Error("Already stored");
    };


    /* Update the rack to say it contains now the bulksolid */
    const updatedRack = await MRack.findOneAndUpdate(

      /* get the name of the rack */
      { rackName: currentRackName },

      /* set the rackField to the sourceitem. a rackfield can only contain a single bulk solid item */
      { $set: { [`rackFields.${targetFieldID}`]: sourceItemID } },

      /* OPTIONS */
      {
        /* return the updated item */
        returnOriginal: false,

        /* upsert true for creating a rackfield if it does not exist yet */
        upsert: true,

        /* attach it to session */
        session: moveBulkSolidSession
      })


    /* if the updatedRack is null, throw error */
    if (!updatedRack) {
      throw new Error("Rack Error")
    };


    /* commit the tranaction */
    await moveBulkSolidSession.commitTransaction()
    /* and response to the request with the updated rack. */
    console.log("")
    console.log("POST - MOVEBULKSOLID -- updatedRack")
    console.log(updatedRack)
    console.log("--------------------")
    console.log("")
    return res.send(updatedRack)


    /* the errorhandler */
  } catch (error) {
    /* abort session */
    await moveBulkSolidSession.abortTransaction()
    moveBulkSolidSession.endSession()
    /* send the error back */
    console.log("")
    console.log("POST - MOVEBULKSOLID -- ERROR")
    console.log(error)
    console.log("--------------------")
    console.log("")
    const apiError = new MyError(error.message, 500)
    next(apiError)
  }


})



bulkSolidRouter.put('/onhold', (req, res, next) => {
  const bulkSolidIDToChange = req.body.bulkSolidID

  MBulkSolid.findOneAndUpdate(
    { bulkSolidID: bulkSolidIDToChange },
    { onHold: false },
    { returnOriginal: false }
  )
    .then(updatedBulkSolid => {
      console.log("")
      console.log("POST - removeonhold -- BulkSolid")
      console.log(updatedBulkSolid)
      console.log("--------------------")
      console.log("")
      res.send(updatedBulkSolid)
    })
    .catch(error => {
      console.log("")
      console.log("POST - removeonhold -- ERROR")
      console.log(error)
      console.log("--------------------")
      console.log("")
      const apiError = new MyError(error.message, 500)
      next(apiError)
    })

})

bulkSolidRouter.use('*', (req, res, next) => {
  const error = new MyError('Wrong Bulksolid URL', 404)
  next(error)
})


export default bulkSolidRouter