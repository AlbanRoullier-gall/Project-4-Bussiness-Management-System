import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Graph1.css';


const Graph1 = () => {
  const data = [
    {
      name: 'Jan',
      actuel:200,
      refusé:100,
      accepté: 4000,
      expiré: 2400,
      amt: 2400,
    },
    {
      name: 'Feb',
      actuel:200,
      refusé:100,
      accepté: 3000,
      expiré: 1398,
      amt: 2210,
    },
    {
      name: 'Mar',
      actuel:200,
      refusé:100,
      accepté: 2000,
      expiré: 9800,
      amt: 2290,
    },
    {
      name: 'Apr',
      actuel:200,
      refusé:100,
      accepté: 2780,
      expiré: 3908,
      amt: 2000,
    },
    {
      name: 'May',
      actuel:200,
      refusé:100,
      accepté: 1890,
      expiré: 4800,
      amt: 2181,
    },
    {
      name: 'Jun',
      actuel:200,
      refusé:100,
      accepté: 2390,
      expiré: 3800,
      amt: 2500,
    },
    {
      name: 'Jul',
      actuel:200,
      refusé:100,
      accepté: 3490,
      expiré: 4300,
      amt: 2100,
    },
    {
      name: 'Aug',
      actuel:200,
      refusé:100,
      accepté: 2000,
      expiré: 9800,
      amt: 2290,
    },
    {
      name: 'Sep',
      actuel:200,
      refusé:100,
      accepté: 2780,
      expiré: 3908,
      amt: 2000,
    },
    {
      name: 'Oct',
      actuel:200,
      refusé:100,
      accepté: 1890,
      expiré: 4800,
      amt: 2181,
    },
    {
      name: 'Nov',
      actuel:200,
      refusé:100,
      accepté: 2390,
      expiré: 3800,
      amt: 2500,
    },
    {
      name: 'Dec',
      actuel:200,
      refusé:100,
      accepté: 3490,
      expiré: 4300,
      amt: 2100,
    },
  ];

  const CustomTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={12} textAnchor="end" fill="#666">
          {payload.value}
        </text>
      </g>
    );
  };

  return (
      <ResponsiveContainer width="50%" height={500}>
        <h4>DEVIS</h4>
        <div>
          <ul className='Agencement'>
            <li className="red">REFUSE</li>
            <li className="green">ACCEPTE</li>
            <li className="blue">EXPIRE</li>
            <li className="yellow">ACTUEL</li>
          </ul>
        </div>
        <div>
        <ul className='Agencement'>
            <li>€ 2225.00</li>
            <li>€ 2225.00</li>
            <li>€ 2225.00</li>
            <li>€ 2225.00</li>
          </ul>
        </div>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 100,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={<CustomTick />} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="expiré" stackId="a" fill="#FF0000" barSize={20}/>
          <Bar dataKey="accepté" stackId="a" fill="#14FF00" barSize={20} />
          <Bar dataKey="refusé" stackId="a" fill="#173058" barSize={20} />
          <Bar dataKey="actuel" stackId="a" fill="#FFB100" barSize={20}/>
        </BarChart>
    </ResponsiveContainer>
  );
};

export default Graph1;
