import { Document } from 'mongoose';

export default interface IBulkSolid extends Document {
  bulkSolidID: number,
  aID: string,
  arrivalDate: string,
  bulkSolidShape: string,
  casNumber: string,
  density: string,
  description: string,
  enteredBy: string,
  exprotection: boolean,
  msds: boolean,
  msdsFile: string,
  note: string,
  pictureFile: string,
  onHold: boolean,
  storedAt: [string]
}