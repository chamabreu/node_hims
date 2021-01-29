import express, { Request, Response } from 'express';
import MPallet from './Models/MPallet';
import IPallet from './Interfaces/IPallet'
import IBulkSolid from './Interfaces/IBulkSolid'
import MBulkSolid from './Models/MBulkSolid'


const router = express.Router()


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


router.post('/bulksolid', (req: Request, res: Response) => {
  const {
    bulkSolidID,
    description,
    client,
    aID,
    clientContact,
    msds,
    exprotection,
    weight,
    size,
    palletCount,
    archive,
    note,
    storageLocation,
    bundle,
    customBundle,
    wastedBy,
    wasteDate,
    arrivalDate,
    enteredBy,
  }: IBulkSolid = req.body


  const newBulkSolid = new MBulkSolid({
    bulkSolidID,
    description,
    client,
    aID,
    clientContact,
    msds,
    exprotection,
    weight,
    size,
    palletCount,
    archive,
    note,
    storageLocation,
    bundle,
    customBundle,
    wastedBy,
    wasteDate,
    arrivalDate,
    enteredBy,
  })

  newBulkSolid.save()
    .then(rBulkSolid => {
      console.log(rBulkSolid)
      res.send(rBulkSolid)
    })
    .catch(error => {
      console.log(error)
      res.send(error)
    })

})


export default router