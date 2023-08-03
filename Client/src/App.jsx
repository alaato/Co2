import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const qualityColor = function (quality = '')
{
if (quality == 'good') return 'green';
else if (quality == 'bad')return 'red';
else if (quality == 'average') return 'yellow';
else return '';
}


function App() {
  const [data, setData] = useState([]);
  let CurrentData = data[data.length - 1] || null ;
  // Function to update the CO2 values on new data
  const updateData = (newValue) => {
    setData((prevValues) => {
      if (prevValues.length > 9)
      return [...prevValues.slice(1), newValue]
      else return [...prevValues, newValue]
    });
  };

  // Socket.IO setup
  useEffect(() => {
    const socket = io('http://localhost:3001');
    socket.on('data', (data) => {
      updateData(data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);


  return (
    <div className="App">
      <h1>CO2 Visualization</h1>

      <h3>
        Current reading is : {data[data.length-1] ? data[data.length-1].reading:'loading' }
        </h3>

      <h3>
        Current Air quality : <span className= {CurrentData && qualityColor(CurrentData.quality)}> 
           {CurrentData ? CurrentData.quality : 'loading'} 
          </span> 
        </h3>
      
        <LineChart
          width={900}
          height={400}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="reading" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
    </div>
  );
}

export default App;