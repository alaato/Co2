require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});
main().catch(err => console.log(err));

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB);
  } catch (error) {
    handleError(error);
  }}

// creating a model for the readings collection
const Data = mongoose.model('reading', {reading: Number, quality: String, date: String});

Data.watch().on("change", data => {
        io.emit('data', data.fullDocument);
});

// Function to generate random CO2 values between 400 and 3500 ppm
function randomPpm() {
  return Math.floor(Math.random() * (3500 - 400 + 1)) + 400;
}
// checks the air quality
const checkQuality = function(reading)
{
    if(reading <= 1000)
        return 'Good'
    else if(reading > 1000 && reading <= 2000)
        return 'Average'
    else if(reading > 2000)
        return 'Bad'
}

const makeData = function()
{
  const reading = randomPpm();
  const quality = checkQuality(reading);
  const date = new Date(Date.now()).toString().slice(4, -40).replace('2023', '');
  const data = {reading: reading, quality: quality, date: date}
  return data;
}


app.get('/api/data', async(req, res) => {
  const data = await Data.find({}).sort({_id:-1}).limit(10).exec();
  res.json(data);
})

// Send CO2 values to all connected clients every 10 seconds
setInterval(async() => {
  const data = new Data(makeData())
  console.log(data)

  await data.save();
}, 10000);

// Start the server
server.listen(3001, () => {
  console.log('Backend server started on http://localhost:3001');
});