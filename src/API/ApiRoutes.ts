/* Imports */
import express, { Request, Response } from 'express';
import StoreRouter from './StoreRouter'
import OnHoldRouter from './OnHoldRouter'
const apiRouter = express.Router()

/* ROUTES OF .../api */


/* Store route to handle store requests */
apiRouter.use('/store', StoreRouter)
/* onhold requests */
apiRouter.use('/onhold', OnHoldRouter)
/* public access to /media. a rework to specific routes to pictures needs more work */
apiRouter.use('/media', express.static('media'))

apiRouter.use('*', (req, res) => {
  console.log('hier gibts nichts zu sehen')
  res.status(404).send('not found')
})


export default apiRouter