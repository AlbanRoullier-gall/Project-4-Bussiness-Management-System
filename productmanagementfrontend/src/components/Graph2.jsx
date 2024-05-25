import React from 'react';
import './Graph2.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';


const Graph2 = () => {

    const data = [
        {
          name: 'Jan',
          pv:200,
          uv:100,
        },
        {
          name: 'Feb',
          pv:300,
          uv:100,
        },
        {
          name: 'Mar',
          pv:400,
          uv:100,
        },
        {
          name: 'Apr',
          pv:200,
          uv:100,
        },
        {
          name: 'May',
          pv:200,
          uv:100,
        },
        {
          name: 'Jun',
          pv:600,
          uv:100,
        },
        {
          name: 'Jul',
          pv:200,
          uv:100,
        },
        {
          name: 'Aug',
          pv:200,
          uv:100,
        },
        {
          name: 'Sep',
          pv:200,
          uv:100,
        },
        {
          name: 'Oct',
          pv:200,
          uv:100,
        },
        {
          name: 'Nov',
          pv:200,
          uv:100,
        },
        {
          name: 'Dec',
          pv:200,
          uv:100,
        },
      ];

  return (
    <ResponsiveContainer width="50%" height={500}>
        <h4>CHIFFRE D'AFFAIRE</h4>
      <div>
        <ul className='Agencement'>
          <li className="green2">CHIFFRE D'AFFAIRE</li>
          <li className="blue2">BENEFICE</li>
        </ul>
      </div>
      <div>
      <ul className='Agencement'>
          <li>€ 2225.00</li>
          <li>€ 2225.00</li>
        </ul>
      </div>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 100,
          right: 40,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="pv" stroke="#21D59B" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="uv" stroke="#0076FF" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Graph2;
