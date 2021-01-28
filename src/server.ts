/* Imports */
import * as dotenv from 'dotenv'
import express from 'express';
import mongoose from 'mongoose';
dotenv.config()

/* App Config */
const app = express()



/* MONGOOSE */
mongoose.connect(process.env.MONGODB, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(result => {
    console.log("Connected")
  })
  .catch(error => {
    console.log("error")
    console.log(error)
  })



/* Routes */
app.get('/', (req, res) => {
  res.send("ANOTHER TEST")
})

app.get('/get', (req, res) => {

  res.send("USER LISTED")
})

app.get('/post', (req, res) => {
  // let [first, last] = ["Jemand", "Anders"]

  // const newUser = new User({
  //   firstName: first,
  //   lastName: last
  // })

  // newUser.save()
  // .then(rUser => {
  //   res.send(rUser.firstName)
  // })
  // .catch(error => {
  //   res.send("Error")
  // })

})



/* Port Listen */
app.listen(5000, () => {
  console.log("Server is running")
})


