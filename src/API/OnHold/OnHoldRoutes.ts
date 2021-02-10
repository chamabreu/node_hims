import express from 'express';
import MBulkSolid from '../../Models/MBulkSolid';

const onHoldRouter = express()


/* get the bulk solids which are onHold */
onHoldRouter.get('/data', (req, res) => {
  /* find MBulksolids */
  MBulkSolid.find(
    /* which are onHold */
    { onHold: true },

    /* response handler */
    (error, data) => {

      if (error) {
        return res.send(error)


      } else {
        /* send the bulk solid fields */
        return res.send(data)
      }
    })

})




export default onHoldRouter