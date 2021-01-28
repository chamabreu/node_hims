import IPallet from '../Interfaces/IPallet'
import mongoose, { Schema } from 'mongoose'

const PalletSchema: Schema = new Schema({
  palletID: {
    type: String,
    required: true

  },
  releasedFromStock: {
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
  enteredBy: {
    type: String,
    required: true
  }
},
  {
    timestamps: true
  }
)

export default mongoose.model<IPallet>('Pallet', PalletSchema)