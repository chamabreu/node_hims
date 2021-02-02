import express, { Request, Response } from 'express';
import MPallet from './Models/MPallet';
import IPallet from './Interfaces/IPallet'
import IBulkSolid from './Interfaces/IBulkSolid'
import MBulkSolid from './Models/MBulkSolid'
import IBulkSolidCounter from './Interfaces/IBulkSolidCounter'
import MBulkSolidCounter from './Models/MBulkSolidCounter'


const router = express.Router()


router.get('/', (req: Request, res: Response) => {
  MBulkSolid.find({onHold: true}, (error, data) => {
    if (error) {
      res.send(error)
      return
    } else {
      res.send(data)
      return
    }
  })

})



export default router