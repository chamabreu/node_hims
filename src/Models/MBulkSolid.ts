import IBulkSolid from '../Interfaces/IBulkSolid'
import mongoose, { Schema } from 'mongoose'

const BulkSolidSchema: Schema = new Schema({
  bulkSolidID: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  client: {
    type: String,
    required: true
  },
  aID: {
    type: String,
    required: true
  },
  clientContact: {
    type: String,
    required: true
  },
  msds: {
    type: Boolean,
    required: true
  },
  exprotection: {
    type: Boolean,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  palletCount: {
    type: Number,
    required: true
  },
  archive: {
    type: Boolean,
    required: true
  },
  note: {
    type: String,
    required: true
  },
  storageLocation: {
    type: String,
    required: true
  },
  bundle: {
    type: String,
    required: true
  },
  customBundle: {
    type: String,
    required: true
  },
  wastedBy: {
    type: String,
    required: true
  },
  wasteDate: {
    type: String,
    required: true
  },
  arrivalDate: {
    type: String,
    required: true
  },
  enteredBy: {
    type: String,
    required: true
  },
},
  {
    timestamps: true
  }
)

export default mongoose.model<IBulkSolid>('BulkSolid', BulkSolidSchema)