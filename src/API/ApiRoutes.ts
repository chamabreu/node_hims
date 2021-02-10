/* Imports */
import express from 'express';
import RackRouter from './Rack/RackRoutes'
import BulkSolidRouter from './Bulksolid/BulkSolidRoutes'
import OnHoldRouter from './OnHold/OnHoldRoutes'
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


apiRouter.use('*', (req, res) => {
  console.log('hier gibts nichts zu sehen')
  res.status(404).send('not found')
})


export default apiRouter