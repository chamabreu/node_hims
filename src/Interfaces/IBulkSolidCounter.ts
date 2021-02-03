import { Document } from 'mongoose';

export default interface IBulkSolidCounter extends Document {
  _id: string,
  counterValue: number
}