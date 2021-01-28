import express from 'express'
const router = express.Router()
import MPallet from './Models/MPallet'




router.get('/', (req, res) => {
  MPallet.find({}, (error, data) => {
    if (error) {
      res.send(null)
    }else {
      res.send(data)
    }
    // console.log(error)
  })
})



export default router