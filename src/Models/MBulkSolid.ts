import IBulkSolid from '../Interfaces/IBulkSolid'
import mongoose, { Schema } from 'mongoose'

const BulkSolidSchema: Schema = new Schema({
  bulkSolidID: {
    type: Number,
    required: true
  },
  aID: {
    type: String,
  },
  arrivalDate: {
    type: String,
    required: true
  },
  bulkSolidShape: {
    type: String,
  },
  casNumber: {
    type: String,
  },
  density: {
    type: String,
  },
  description: {
    type: String,
    required: true
  },
  enteredBy: {
    type: String,
    required: true
  },
  exprotection: {
    type: Boolean,
    required: true
  },
  msds: {
    type: Boolean,
    required: true
  },
  msdsFile: {
    type: String,
  },
  note: {
    type: String,
    required: true
  },
  pictureFile: {
    type: String,
  },
  onHold: {
    type: Boolean,
  },
  storedAt: {
    type: [String],
  }
},
  {
    timestamps: true
  }
)

export default mongoose.model<IBulkSolid>('BulkSolid', BulkSolidSchema)