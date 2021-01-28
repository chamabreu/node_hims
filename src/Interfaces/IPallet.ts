import { Document } from 'mongoose';

export default interface IPallet extends Document {
  palletID: string,
  releasedFromStock: boolean,
  note: string,
  storageLocation: string,
  enteredBy: string
}