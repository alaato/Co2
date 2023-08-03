require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors');
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

// Function to generate random CO2 values between 400 and 3500 ppm
function randomPpm() {
  return Math.floor(Math.random() * (3500 - 400 + 1)) + 400;
}
// checks the air quality
const checkQuality = function(reading)
{
    if(reading <= 1000)
        return 'good'
    else if(reading > 1000 && reading <= 2000)
        return 'average'
    else if(reading > 2000)
        return 'bad'
}

const makeData = function()
{
  const reading = randomPpm();
  const quality = checkQuality(reading);
  const date = new Date(Date.now()).toUTCString().slice(4, -4).replace('2023', '');
  const data = {reading: reading, quality: quality, date: date}
  return data;
}


app.get('/api/data', (req, res) => {
  const data = [];
  for(let i = 0; i <10; i++)
  {
    data.push(makeData());
  }
  console
  res.json(data);
})

// Send CO2 values to all connected clients every 10 seconds
setInterval(async() => {
  const data = makeData();
  io.emit('data', data);
}, 10000);

// Start the server
server.listen(3001, () => {
  console.log('Backend server started on http://localhost:3001');
});