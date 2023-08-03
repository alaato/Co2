import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const CustomTooltip = ({ active, payload,  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="text">{`${payload[0].value} ${payload[0].payload.quality}`}</p>
        </div>
      );
    }
  
    return null;
  };
  

export default function Chart ({data}) {
    return (
<LineChart
          width={1200}
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
          <Tooltip content={<CustomTooltip/>} />
          <Legend />
          <Line type="monotone" dataKey="reading" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>

    )
    }