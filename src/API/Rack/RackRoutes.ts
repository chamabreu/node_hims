import express from 'express';
import { MyError } from '../../Errorhandler';
import MBulkSolid from '../../Models/MBulkSolid';
import MRack from '../../Models/MRack';
const rackRouter = express()


/* GET */


/*
get the rack details. this gets rackfields with its content ids and
all bulk solid ids which are needed by the rackfields
*/
rackRouter.get('/getrack', async (req, res) => {
  /* in req.query is the rackname which is shown to the user */
  const occupiedRackFields = await MRack.findOne(req.query, {}, {})

  /* if there are no occupiedRackFields due to never stored a item in a rackfield */
  if (!occupiedRackFields) {
    console.log("")
    console.log("GET - rackdetails -- ERROR")
    console.log("keine occupiedRackFields")
    console.log("--------------------")
    console.log("")
    /* return null */

    return res.send({ noData: true })
  };


  /* get all single bulkSolidIDs in an array */
  const bulkSolidIDs: number[] = []
  for (const rackField of Object.keys(occupiedRackFields.rackFields)) {
    const singleBulkSolidID = occupiedRackFields.rackFields[rackField]
    !bulkSolidIDs.includes(singleBulkSolidID) && bulkSolidIDs.push(singleBulkSolidID)
  }


  /* find all MBulkSolid objects by the IDs */
  const bulkSolidObjects = await MBulkSolid.find({ bulkSolidID: { $in: bulkSolidIDs } }, {}, {})


  console.log("")
  console.log("GET - rackdetails -- bulksolids, occupiedRackfields")
  console.log(bulkSolidObjects)
  console.log(occupiedRackFields.rackFields)
  console.log("--------------------")
  console.log("")
  /* send the bulksolid objects and the rackfields as object */
  res.send({ bulkSolids: bulkSolidObjects, rackFields: occupiedRackFields.rackFields })

})




rackRouter.use('*', (req, res, next) => {
  const error = new MyError('Wrong Rack URL', 404)
  next(error)
})



export default rackRouter