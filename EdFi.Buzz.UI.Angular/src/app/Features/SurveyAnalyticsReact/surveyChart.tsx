import * as React from 'react';
import { ChartComponentProps, HorizontalBar } from 'react-chartjs-2';
import { SurveyQuestionSummary } from 'src/app/Models';
import { Easing } from 'chart.js';


export interface SurveyChartComponentProps {
  question: SurveyQuestionSummary;
  title?: string | React.ReactElement;
  afterSelectionChangedHandler?: (newSelection: string) => void;
}

function generateHslaColors(saturation, lightness, alphaBG, alphaBr, alphaHv, amount) {
  const colors = { backgroundColor: [], borderColor: [], hoverBackgroundColor: [], selectedBackgroundColor: [] };
  const huedelta = Math.trunc(360 / amount);

  for (let i = 0; i < amount; i++) {
    const hue = i * huedelta;
    colors.backgroundColor.push(`hsla(${hue},${saturation}%,${lightness}%,${alphaBG})`);
    colors.hoverBackgroundColor.push(`hsla(${hue},${saturation}%,${lightness}%,${alphaHv})`);
    colors.selectedBackgroundColor.push(`hsla(${hue},${saturation}%,${lightness * 0.80}%,${alphaBr})`);
    colors.borderColor.push(`hsla(${hue},${saturation}%,${lightness * 0.80}%,${alphaBG * 1.2})`);
  }

  return colors;
}

export const SurveyChart: React.FunctionComponent<SurveyChartComponentProps> = (props: SurveyChartComponentProps) => {
  const [selectedAnswer, setSelectedAnswer] = React.useState(null);

  const question = props.question;

  const colors = generateHslaColors(50, 80, 0.4, 1.0, 0.8, question.answers.length);
  const chartData: ChartComponentProps = {
    height: 30 + question.answers.length * 40,
    data: (canvas) => {
      const bgs = colors.backgroundColor.map((color, idx) => {
        if (selectedAnswer && question.answers[idx].label === selectedAnswer) {
          return colors.selectedBackgroundColor[idx];
        }
        return color;
      });

      return {
        labels: question.answers.map(a => a.label),
        datasets: [
          {
            data: question.answers.map(a => a.count),
            label: question.question,
            backgroundColor: bgs,
            borderColor: colors.borderColor,
            hoverBackgroundColor: colors.hoverBackgroundColor,
            hoverBorderWidth: 2,
            borderWidth: 1,
          }
        ]
      };
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{ display: false, }],
        xAxes: [{
          ticks: {
            /** Fix to getting the minimum value as origin and thus not visible */
            suggestedMin: Math.floor(Math.min.apply(null, question.answers.map(e => e.count)) * 0.90)
          }
        }]
      },
      plugins: { legendOnBar: { selectdBarLegend: () => selectedAnswer } }
    },
    legend: { display: false },
    plugins: [
      {
        afterDatasetDraw: function (chartInstance/*: Chart*/, easing: Easing, options?: any) {
          const ctx = chartInstance.ctx;

          const heigth = chartInstance.chartArea.bottom;
          const left = chartInstance.chartArea.left;
          const width = chartInstance.chartArea.right;
          const steps = chartInstance.data.labels.length;
          const stepH = heigth / steps;

          const fontNormal = 'normal 12px "Helvetica Neue", "Helvetica", "Arial", sans-serif';
          const fontSelected = 'bold 14px "Helvetica Neue", "Helvetica", "Arial", sans-serif';

          ctx.save();
          ctx.shadowBlur = 3;
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
          ctx.fillStyle = 'black';

          const fontSize = ctx.measureText('M').width;
          const textX = left + fontSize;

          const totalData = chartInstance.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const selectedLegend = chartInstance.options.plugins.legendOnBar.selectdBarLegend();
          for (let i = 0; i < chartInstance.data.labels.length; i++) {
            ctx.font = chartInstance.data.labels[i] === selectedLegend ? fontSelected : fontNormal;
            const textY = (i * stepH) + ((stepH + fontSize) / 2);
            const text = chartInstance.data.labels[i] as string;
            const percent = Math.floor((100 * chartInstance.data.datasets[0].data[i]) / totalData);
            chartInstance.ctx.fillText(`[${percent}%] ${text}`, textX, textY, width);
          }
          chartInstance.ctx.restore();
        }
      }
    ]
  };

  function onClickHandler(evt) {
    if (evt.length === 0) { return; }
    const point = evt[0];
    const chart = point._chart.config;
    const datasetIndex = point._datasetIndex;
    const dataIndex = point._index;
    const label = chart.data.labels[dataIndex];
    // var value = chart.data.datasets[datasetIndex].data[dataIndex];
    chart.data.datasets[datasetIndex].backgroundColor[dataIndex] =
      selectedAnswer !== label ? colors.selectedBackgroundColor[dataIndex] : colors.backgroundColor[dataIndex];

    const newSelectedAnswer = selectedAnswer !== label ? label : null;
    setSelectedAnswer(newSelectedAnswer);
    if (props.afterSelectionChangedHandler) {
      props.afterSelectionChangedHandler(newSelectedAnswer);
    }
  }

  return <>
    {(props.title) && <h2>{props.title}</h2>}
    <div className='row'>
      <div className='col-12'>
        <HorizontalBar
          data={chartData.data}
          height={chartData.height}
          options={chartData.options}
          legend={chartData.legend}
          getElementAtEvent={onClickHandler}
          plugins={chartData.plugins}
          key={question.surveyquestionkey}
        />
      </div>
    </div>
  </>;
};
