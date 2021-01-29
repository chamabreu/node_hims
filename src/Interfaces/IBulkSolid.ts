import { Document } from 'mongoose';

export default interface IBulkSolid extends Document {
  bulkSolidID: number,
  description: string,
  client: string,
  aID: string,
  clientContact: string,
  msds: boolean,
  exprotection: boolean,
  weight: number,
  size: number,
  palletCount: number,
  archive: boolean,
  note: string,
  storageLocation: string,
  bundle: string,
  customBundle: string,
  wastedBy: string,
  wasteDate: string,
  arrivalDate: string,
  enteredBy: string
}