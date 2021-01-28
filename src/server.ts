import express from 'express';
const app = express()


app.get('/', (req, res) => {
  res.send("ANOTHER TEST")
})

app.get('/home', (req, res) => {
  res.send("HOME")
})

app.listen(5000, () => {
  console.log("Server is running")
})


