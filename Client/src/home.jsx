import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import Chart from './Chart'

const qualityColor = function (quality = '')
{
if (quality == 'good') return 'green';
else if (quality == 'bad')return 'red';
else if (quality == 'average') return 'yellow';
else return '';
}


export default function Home (options) {
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
    fetch('https://co2-meaurement.onrender.com/api/data')
      .then((response) => response.json())
      .then((data) => {
        setData(data); // Set the initial data to the state
      })
      .catch((error) => {
        console.error('Error fetching initial data from backend:', error);
      });

    const socket = io('https://co2-meaurement.onrender.com');
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
       <Chart data={data}/>
       <p>*mesurments are taken every 10 seconds</p>
    </div>
  );
}