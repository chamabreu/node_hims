/* Imports */
import express, { Request, Response } from 'express';
import MPallet from '../Models/MPallet';
import IPallet from '../Interfaces/IPallet'
import MBulkSolid from '../Models/MBulkSolid'
import MBulkSolidCounter from '../Models/MBulkSolidCounter'
import { BulkSolidStoreMW } from './BulkSolidStoreMW'
import MRack from '../Models/MRack'
import mongoose from 'mongoose';
import multer from 'multer';
const router = express.Router()


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




/* ROUTES of .../api/store*/



/* bulksolid storage */
router.post(
  /* route */
  '/bulksolid',

  /* Middleware for multer */
  bulkSolidPicture.fields(
    [
      { name: 'bulkSolidPicture' },
      { name: 'msdsFile' }
    ]
  ),

  /* Middleware to store the data */
  BulkSolidStoreMW,
)





/* pallet storage - out of function */
router.post('/pallet', (req: Request, res: Response) => {
  res.send('Out of Function')
  // const {
  //   palletID,
  //   releasedFromStock,
  //   note,
  //   storageLocation,
  //   enteredBy
  // }: IPallet = req.body


  // const newPallet = new MPallet({
  //   palletID,
  //   releasedFromStock,
  //   note,
  //   storageLocation,
  //   enteredBy,
  // })

  // newPallet.save()
  //   .then(rPallet => {
  //     console.log(rPallet)
  //     res.send(rPallet)
  //   })
  //   .catch(error => {
  //     console.log(error)
  //     res.send(error)
  //   })

})




/* drag drop handler to update rackFields and bulksolid.storedAt[] */
router.post('/movebulksolid', async (req, res) => {

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
    return res.send({ updatedRack })


    /* the errorhandler */
  } catch (error) {
    /* abort session */
    await moveBulkSolidSession.abortTransaction()
    moveBulkSolidSession.endSession()
    /* send the error back */
    console.log(error)
    return res.send(error)
  }


})


/* get the countervalue for a new bulk solid ID */
router.get("/newbulksolidid", (req, res) => {
  /* find bulksolidcounter */
  MBulkSolidCounter.findById("bulksolidcounter", {}, {}, (err, data) => {
    /* if error  */
    if (err) return res.send(err)

    /* else send latest counter value */
    res.send({ lastCounterValue: data.counterValue })
  })
})



/*
get the rack details. this gets rackfields with its content ids and
all bulk solid ids which are needed by the rackfields
*/
router.get('/rackdetails', async (req, res) => {
  /* in req.query is the rackname which is shown to the user */
  const occupiedRackFields = await MRack.findOne(req.query, {}, {})

  /* if there are no occupiedRackFields due to never stored a item in a rackfield */
  if (!occupiedRackFields) {
    /* return null */
    return res.send(null)
  };


  /* get all single bulkSolidIDs in an array */
  const bulkSolidIDs: number[] = []
  for (const rackField of Object.keys(occupiedRackFields.rackFields)) {
    const singleBulkSolidID = occupiedRackFields.rackFields[rackField]
    !bulkSolidIDs.includes(singleBulkSolidID) && bulkSolidIDs.push(singleBulkSolidID)
  }


  /* find all MBulkSolid objects by the IDs */
  const bulkSolidObjects = await MBulkSolid.find({ bulkSolidID: { $in: bulkSolidIDs } }, {}, {})

  /* send the bulksolid objects and the rackfields as object */
  res.send({ bulkSolids: bulkSolidObjects, rackFields: occupiedRackFields.rackFields })

})



export default router