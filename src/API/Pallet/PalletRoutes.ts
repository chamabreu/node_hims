import express from 'express';
const palletRouter = express()


/* GET */




/* POST */


/* pallet storage - out of function */
palletRouter.post('/pallet', (req, res) => {
  res.send('Out of Function')
  // const {
  //   palletID,
  //   releasedFromStock,
  //   note,
  //   storageLocation,
  //   enteredBy
  // }: IPallet = req.body


  // const newPallet = new MPallet({
  //   palletID,
  //   releasedFromStock,
  //   note,
  //   storageLocation,
  //   enteredBy,
  // })

  // newPallet.save()
  //   .then(rPallet => {
  //     console.log(rPallet)
  //     res.send(rPallet)
  //   })
  //   .catch(error => {
  //     console.log(error)
  //     res.send(error)
  //   })

})








export default palletRouter