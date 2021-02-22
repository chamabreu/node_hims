import express from 'express';
import { MyError } from '../../Errorhandler';
import MBulkSolid from '../../Models/MBulkSolid';

const onHoldRouter = express()


/* get the bulk solids which are onHold */
onHoldRouter.get('/data', (req, res, next) => {
  /* find MBulksolids */
  MBulkSolid.find(
    /* which are onHold */
    { onHold: true },

    /* response handler */
    (error, data) => {

      if (error) {
        const apiError = new MyError(error, 500)
        next(apiError)


      } else {
        /* send the bulk solid fields */
        return res.send(data)
      }
    })

})



onHoldRouter.use('*', (req, res, next) => {
  const error = new MyError('Wrong OnHold URL', 404)
  next(error)
})

export default onHoldRouter