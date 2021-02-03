/* Imports */
import express, { Request, Response } from 'express';
import MBulkSolid from '../Models/MBulkSolid'
const router = express.Router()

/* ROUTES OF .../api/onhold */


/* get the bulk solids which are onHold */
router.get('/', (req: Request, res: Response) => {
  /* find MBulksolids */
  MBulkSolid.find(
    /* which are onHold */
    { onHold: true },

    /* response handler */
    (error, data) => {

      if (error) {
        return res.send(error)
      
      
      }else {
        /* send the bulk solid fields */
        return res.send(data)
      }
    })

})



export default router