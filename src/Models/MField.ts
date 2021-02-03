import IField from '../Interfaces/IField'
import mongoose, { Schema } from 'mongoose'

const FieldSchema: Schema = new Schema({
  fieldName: String,
  contentIT: Number
},
  {
    timestamps: true
  }
)

export default mongoose.model<IField>('Fields', FieldSchema)