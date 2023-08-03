import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Chart from './Chart'

const qualityColor = function (quality)
{
if (quality == 'Good') return 'green';
else if (quality == 'Bad')return 'red';
else if (quality == 'Average') return 'yellow';
else return '';
}


export default function Home (options) {
    const [data, setData] = useState([]);

    let CurrentData = data[data.length - 1] || null ;

  //  update the CO2 value on new data
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
        Current reading is : {CurrentData ? CurrentData.reading:'loading' } ppm
        </h3>

      <h3>
        Current Air quality : <span className= {CurrentData && qualityColor(CurrentData.quality)}> 
           {CurrentData ? CurrentData.quality : 'loading'} 
          </span> 
        </h3>
       <Chart data={data}/>
       <p>*mesurments are taken every 10 seconds</p>
       <p>* GMT TIME </p>
    </div>
  );
}