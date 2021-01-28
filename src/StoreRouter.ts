import express, { Request, Response } from 'express';
import MPallet from './Models/MPallet';
import IPallet from './Interfaces/IPallet'
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


export default router