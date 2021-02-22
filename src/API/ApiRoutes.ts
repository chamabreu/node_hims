/* Imports */
import express from 'express';
import RackRouter from './Rack/RackRoutes'
import BulkSolidRouter from './Bulksolid/BulkSolidRoutes'
import OnHoldRouter from './OnHold/OnHoldRoutes'
import { MyError } from '../Errorhandler'

const apiRouter = express.Router()

/* ROUTES OF .../api */

/* bulksolid request */
apiRouter.use('/bulksolid', BulkSolidRouter)


/* rack requests */
apiRouter.use('/rack', RackRouter)


/* onhold requests */
apiRouter.use('/onhold', OnHoldRouter)


/* public access to /media. a rework to specific routes to pictures needs more work */
apiRouter.use('/media', express.static('media'))


/* Handle not given routes */
apiRouter.use('*', (req, res, next) => {
  const error = new MyError('Wrong API Route', 404)
  next(error)
})


export default apiRouter