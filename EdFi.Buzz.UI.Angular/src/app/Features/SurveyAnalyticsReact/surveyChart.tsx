import * as React from 'react';
import { Bar, ChartComponentProps } from 'react-chartjs-2';
import { SurveyQuestionSummary } from 'src/app/Models';


export interface SurveyChartComponentProps {
  question: SurveyQuestionSummary;
}

function generateHslaColors(saturation, lightness, alphaBG, alphaBr, alphaHv, amount) {
  let colors = { backgroundColor: [], borderColor: [], hoverBackgroundColor: [], selectedBackgroundColor: [] };
  let huedelta = Math.trunc(360 / amount)

  for (let i = 0; i < amount; i++) {
    let hue = i * huedelta
    colors.backgroundColor.push(`hsla(${hue},${saturation}%,${lightness}%,${alphaBG})`)
    colors.hoverBackgroundColor.push(`hsla(${hue},${saturation}%,${lightness}%,${alphaHv})`)
    colors.selectedBackgroundColor.push(`hsla(${hue},${saturation}%,${lightness * 0.80}%,${alphaBr})`)
    colors.borderColor.push(`hsla(${hue},${saturation}%,${lightness * 0.80}%,${alphaBG * 1.2})`)
  }

  return colors
}

export const SurveyChart: React.FunctionComponent<SurveyChartComponentProps> = (props: SurveyChartComponentProps) => {
  const [selectedAnswer, setSelectedAnswer] = React.useState(null);

  const question = props.question;

  const colors = generateHslaColors(50, 80, 0.4, 1.0, 0.8, question.answers.length);
  const chartData: ChartComponentProps = {
    height: 300,
    data: {
      labels: question.answers.map(a => a.label),
      datasets: [
        {
          data: question.answers.map(a => a.count),
          label: question.question,
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          hoverBackgroundColor: colors.hoverBackgroundColor,
          hoverBorderWidth: 2,
          borderWidth: 1,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            /** Fix to getting the minimum value as origin and thus not visible */
            suggestedMin: Math.floor(Math.min.apply(null, question.answers.map(e => e.count)) * 0.90)
          }
        }]
      }
    },
    legend: {
      display: false
    }
  };

  function onClickHandler(evt){
    const point = evt[0];
    const chart = point._chart.config;
    const datasetIndex = point._datasetIndex;
    const dataIndex = point._index;
    var label = chart.data.labels[dataIndex];
    //var value = chart.data.datasets[datasetIndex].data[dataIndex];
    chart.data.datasets[datasetIndex].backgroundColor[dataIndex] =
      selectedAnswer !== label ? colors.selectedBackgroundColor[dataIndex] : colors.backgroundColor[dataIndex];

    //alert(`[${label}][${value}]`)
    setSelectedAnswer(selectedAnswer !== label ? label : null);
  }

  return <div className="col-12 col-md-6">
    <div id="chartCard" className="card">
      <div className="card-body">
        <h2>Analysing Question: "{props.question.question}"</h2>
        <div className="row">
          <div className="col-12">
            <Bar
              data={chartData.data}
              height={chartData.height}
              options={chartData.options}
              legend={chartData.legend}
              getElementAtEvent={onClickHandler}
            />
          </div>
          <div>{selectedAnswer}</div>
        </div>
      </div>
    </div>
  </div>
}
