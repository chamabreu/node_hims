import express from 'express';
import { API_Error } from '../../Errorhandler';
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
        const apiError = new API_Error(error, 500)
        next(apiError)


      } else {
        /* send the bulk solid fields */
        if (data.length !== 0) {
          return res.send(data)
        } else {
          return res.send({ noData: true })
        }
      }
    })

})



onHoldRouter.use('*', (req, res, next) => {
  const error = new API_Error('Wrong OnHold URL', 404)
  next(error)
})

export default onHoldRouter