import express, { Request, Response } from 'express';
import MPallet from './Models/MPallet';
import IPallet from './Interfaces/IPallet'
import IBulkSolid from './Interfaces/IBulkSolid'
import MBulkSolid from './Models/MBulkSolid'
import MBulkSolidCounter from './Models/MBulkSolidCounter'
import MRack from './Models/MRack'
import mongoose from 'mongoose';
import multer from 'multer';
const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './media/bulksolid/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})


const bulkSolidPicture = multer({ storage: storage })




router.post('/pallet', (req: Request, res: Response) => {
  const {
    palletID,
    releasedFromStock,
    note,
    storageLocation,
    enteredBy
  }: IPallet = req.body


  const newPallet = new MPallet({
    palletID,
    releasedFromStock,
    note,
    storageLocation,
    enteredBy,
  })

  newPallet.save()
    .then(rPallet => {
      console.log(rPallet)
      res.send(rPallet)
    })
    .catch(error => {
      console.log(error)
      res.send(error)
    })

})


router.post('/bulksolid', bulkSolidPicture.fields([{ name: 'bulkSolidPicture' }, { name: 'msdsFile' }]), async (req: Request, res: Response) => {
  const {
    bulkSolidID,
    aID,
    arrivalDate,
    bulkSolidShape,
    casNumber,
    density,
    description,
    enteredBy,
    exprotection,
    msds,
    note,
  }: IBulkSolid = JSON.parse(req.body.bulkSolidData)



  const pictureFile = req.files['bulkSolidPicture'] ? req.files['bulkSolidPicture'][0] : { path: "NA" }
  const msdsFile = req.files['msdsFile'] ? req.files['msdsFile'][0] : { path: "NA" }



  const getNewBulkSolidID =
    await MBulkSolidCounter.findOneAndUpdate(
      { _id: 'bulksolidcounter' },
      { $inc: { counterValue: 1 } },
      { returnOriginal: false }
    )
      .then(doc => {
        return doc.counterValue
      })
      .catch(error => {
        return null
      })


  if (getNewBulkSolidID === bulkSolidID) {

    const newBulkSolid: IBulkSolid = new MBulkSolid({
      bulkSolidID: getNewBulkSolidID,
      aID,
      arrivalDate,
      bulkSolidShape,
      casNumber,
      density,
      description,
      enteredBy,
      exprotection,
      msds,
      msdsFile: msdsFile.path,
      note,
      pictureFile: pictureFile.path,
      onHold: true
    })



    newBulkSolid.save()
      .then(rBulkSolid => {
        res.send(rBulkSolid)
      })
      .catch(error => {
        res.send(error)
      })

  } else {
    res.send("NOT THE RIGHT ID!!!")

  }

})


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
  const session = await mongoose.startSession()
  session.startTransaction()


  /* try catch block for the transaction. because we use await, we can catch all errors at once */
  try {
    /* update first the array in the MBulkSolid object. */
    const updatedBulkSolid = await MBulkSolid.findOneAndUpdate(
      /* Query to find the right item and check that it does not already exist in the target location */
      {
        bulkSolidID: sourceItemID,
        storedAt: { $ne: targetFieldID }
      },
      /* change its onHold state to false to make it disappear in the onhold area */
      /* change the storedAt array to contain the target fieldID */
      {
        onHold: true,
        $push: { storedAt: targetFieldID }
      },
      /* Options */
      {
        returnOriginal: false,
        session: session
      })



    /* If the new bulkSolid is null, throw an error.
    this could be caused because the user tried to set a bulk into a field which already contains stuff.
    this should be implemented to be disabled in the frontend
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
      /* options */
      {
        /* return the updated item */
        returnOriginal: false,
        /* upsert true for creating a rackfield if it does not exist yet */
        upsert: true,
        /* include it in the session */
        session: session
      })

    /* if the updatedRack is null, throw error */
    if (!updatedRack) {
      throw new Error("Rack Error")
    };

    /* commit the tranaction */
    await session.commitTransaction()
    /* and response to the request with the updated bulksolid */
    return res.send({ updatedRack: updatedRack, updatedBulkSolid: updatedBulkSolid })


    /* the errorhandler */
  } catch (error) {
    /* abort session */
    await session.abortTransaction()
    session.endSession()
    /* send the error back */
    console.log(error)
    return res.send(error)
  }


})


router.get("/newbulksolidid", (req, res) => {
  MBulkSolidCounter.findById("bulksolidcounter", {}, {}, (err, data) => {
    if (err) return console.log(err)
    res.send({ lastCounterValue: data.counterValue })
  })
})



router.get('/rackdetails', async (req, res) => {
  const occupiedRackFields = await MRack.findOne(req.query, {}, {})

  if (!occupiedRackFields) {
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

  res.send({ allBulkSolids: bulkSolidObjects, rackFields: occupiedRackFields.rackFields })

})

router.post('/uploadimage', bulkSolidPicture.single('bulkSolidPicture'), (req, res) => {
  console.log(req.file)
  console.log(req.body)
  res.send(req.body)
})



export default router