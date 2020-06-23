import React, { FC, useState, useEffect } from 'react';
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from 'recharts';

import { PieChartProps, PieChartDataItem } from './types/PieChartProps';

const SurveyPieChart: FC<PieChartProps> = ({ questionId, question, answers, radius, width, height, posX, posY }) => {
  const [pieCharDataSetData, setPieCharDataSetDataData] = useState<Array<PieChartDataItem>>([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    // Group and count by answer.
    let groups: { [key: string]: number };
    const counts = answers.reduce((p: { [key: string]: number }, c) => {
      const name = c.answer;
      if (!(groups && groups !== undefined)) {
        groups = p;
      }
      if (!(groups[name] && groups[name] !== undefined)) {
        groups[name] = 0;
      }
      groups[name] += 1;
      return groups;
    }, {});
    // An array is created to be used in pie chart
    const data = Object.keys(counts).map(k => {
      return { name: k, value: counts[k] };
    });
    setPieCharDataSetDataData(data);
  }, [answers]);

  return (
    <ResponsiveContainer>
      <div>
        <div>
          <strong>{question}</strong>
        </div>
        {pieCharDataSetData && pieCharDataSetData.length > 0 ? (
          <div>
            <div>
              <PieChart
                key={questionId}
                width={width && width !== undefined ? width : 320}
                height={height && height !== undefined ? height : 250}
              >
                <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={pieCharDataSetData}
                  cx={posX}
                  cy={posY}
                  outerRadius={radius}
                  fill="#8884d8"
                  labelLine
                  label={entry => `${entry.name} (${entry.value})`}
                >
                  {pieCharDataSetData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        ) : (
          <div>No data</div>
        )}
      </div>
    </ResponsiveContainer>
  );
};
export default SurveyPieChart;
