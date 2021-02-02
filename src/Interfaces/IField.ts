import { Document } from 'mongoose';

export default interface IField extends Document {
  fieldName: string,
  contentID: number
}