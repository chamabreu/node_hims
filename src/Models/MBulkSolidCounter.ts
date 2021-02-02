import IBulkSolidCounter from '../Interfaces/IBulkSolidCounter'
import mongoose, { Schema } from 'mongoose'

const BulkSolidCounterSchema: Schema = new Schema({
  _id: String,
  counterValue: Number
})

export default mongoose.model<IBulkSolidCounter>('BulkSolidCounters', BulkSolidCounterSchema)