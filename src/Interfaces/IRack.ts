import { Document } from 'mongoose';

export default interface IRack extends Document {
  rackName: string,
  rackFields: object
}