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

    await mongoose.connect("mongodb+srv://toalaa9:P5iWY2WEv5iVtq9C@cluster0.rpmdryb.mongodb.net/?retryWrites=true&w=majority");
  }

// creating a model for the readings collection
const Data = mongoose.model('Data', {reading: Number, quality: String, date: String});

Data.watch().on("change", data => {
        io.emit('data', data.fullDocument);
});

// generate a random CO2 value between 400 and 3500 ppm
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

// generate an object containaing all the data
const makeData = function()
{
  const reading = randomPpm();
  const quality = checkQuality(reading);
  const date = new Date(Date.now()).toUTCString().slice(4, -5).replace('2023', '');
  const data = {reading: reading, quality: quality, date: date}
  return data;
}


app.get('/api/data', async(req, res) => {
  try {
    const data = await Data.find({}).sort({_id:-1}).limit(10).exec();
    data.reverse()
    res.json(data);

  } catch (error) {
    console.log(error);
  }
})

// send CO2 values to the client every 10 seconds
setInterval(async() => {

  try{
    const data = new Data(makeData())
    await data.save();
  }
  catch(error) {
  {
    console.log(error);
  }
}
}, 10000);

// start the server
server.listen(3001, () => {
  console.log('Backend server started on http://localhost:3001');
});