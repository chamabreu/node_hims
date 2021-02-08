import { Request, Response, NextFunction } from 'express'
import IBulkSolid from '../Interfaces/IBulkSolid'
import MBulkSolidCounter from '../Models/MBulkSolidCounter'
import MBulkSolid from '../Models/MBulkSolid'
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';


export async function BulkSolidStoreMW(req: Request, res: Response) {


  /* final request - async to enable await */
  /* Deconstruct the bulk solid data. need to be parsed. receives formData because of multer. sender needs to stringify content. */
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


  /* the foldername for the media of the bulkSolidID */
  const bulkSolidIDFolderName = `media/${bulkSolidID.toString()}`

  /* get the pictureFile and the msdsFile if available, or set it to "NA" */
  const pictureFile: { path: string, fileName: string, available: boolean, newPath: string } = {
    path: req.files['bulkSolidPicture'] ? req.files['bulkSolidPicture'][0].path : "NA",
    available: req.files['bulkSolidPicture'] ? true : false,
    fileName: req.files['bulkSolidPicture'] ? req.files['bulkSolidPicture'][0].originalname : undefined,
    newPath: ""
  }

  const msdsFile: { path: string, fileName: string, available: boolean, newPath: string } = {
    path: req.files['msdsFile'] ? req.files['msdsFile'][0].path : "NA",
    available: req.files['msdsFile'] ? true : false,
    fileName: req.files['msdsFile'] ? req.files['msdsFile'][0].originalname : undefined,
    newPath: ""

  }



  /* The Session to start a transaction. This helps on reverting single changes if one action fails */
  const bulkSolidStoreSession = await mongoose.startSession()
  bulkSolidStoreSession.startTransaction()





  try {
    /* Make a folder for the media stuff and name it after the bulkSolidID */
    fs.mkdirSync(bulkSolidIDFolderName, { recursive: true })

    /* Rename and move the files if available */
    if (msdsFile.available) {
      const newMsdsPath = path.join(bulkSolidIDFolderName, msdsFile.fileName)
      fs.renameSync(msdsFile.path, newMsdsPath)
      msdsFile.newPath = newMsdsPath
    }

    if (pictureFile.available) {
      const newPicPath = path.join(bulkSolidIDFolderName, pictureFile.fileName)
      fs.renameSync(pictureFile.path, newPicPath)
      pictureFile.newPath = newPicPath
    }


    /* get a new bulk solid id from bulksolidcounter from DB. increases it on the way by 1 */
    const { counterValue: newBulkSolidID } = await MBulkSolidCounter.findOneAndUpdate(
      /* find the document of bulksolidcounter */
      { _id: 'bulksolidcounter' },

      /* increase the counterValue by 1 */
      { $inc: { counterValue: 1 } },

      {
        /* return new counterValue - this is the new bulk solid ID */
        returnOriginal: false,

        /* Attach it to the session */
        session: bulkSolidStoreSession
      }
    )


    if (newBulkSolidID !== bulkSolidID) {
      /*
      throw error if IDs dont match. this could be if 2 clients try to save at the same time.
      needs rework to handle this error
      */

      throw new Error('ID ERROR')

    };



    /*
    if the received (from frontend) bulkSolidID
    and the above created newBulkSolidID (from DB) match,
    go on
    */
    /* create a new bulk solid from Model */
    const newBulkSolid: IBulkSolid = new MBulkSolid({
      bulkSolidID: newBulkSolidID,
      aID,
      arrivalDate,
      bulkSolidShape,
      casNumber,
      density,
      description,
      enteredBy,
      exprotection,
      msds,
      msdsFile: msdsFile.newPath,
      note,
      pictureFile: pictureFile.newPath,
      onHold: true
    })


    /* save it */
    const savedBulkSolid = await newBulkSolid.save({ session: bulkSolidStoreSession })

    if (!savedBulkSolid) {
      throw new Error('savedBulkSolid ERROR')
    }



    /* commit session and transaction */
    await bulkSolidStoreSession.commitTransaction()

    /* and return new bulkSolid */
    return res.send(savedBulkSolid)



    /* catch any errors */
  } catch (error) {
    /* Abort the transactioon to clean up the database */
    await bulkSolidStoreSession.abortTransaction()
    bulkSolidStoreSession.endSession()

    /* remove the folder with the ID */
    fs.rmSync(bulkSolidIDFolderName, { recursive: true })

    /* Log and return */
    console.log(error)
    return res.send(error)
  }

}