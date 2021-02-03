/* Imports */
import express, { Request, Response } from 'express';
import path from "path";
const reactRouter = express.Router()

/* ROUTES OF .../ */


reactRouter.use('/', express.static(path.join(__dirname, '../', '../', 'react_hims', 'build')))
reactRouter.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../', '../', 'react_hims', 'build', 'index.html'))
})



export default reactRouter