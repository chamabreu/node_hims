import IRack from '../Interfaces/IRack'
import mongoose, { Schema } from 'mongoose'

const RackSchema: Schema = new Schema({
  rackName: String,
  rackFields: Object
},
  {
    timestamps: true
  }
)

export default mongoose.model<IRack>('Racks', RackSchema)