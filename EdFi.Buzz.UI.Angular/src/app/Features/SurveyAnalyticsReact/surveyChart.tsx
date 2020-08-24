import * as React from 'react';
import { ChartComponentProps, HorizontalBar } from 'react-chartjs-2';
import { SurveyQuestionSummary } from 'src/app/Models';
import { Easing } from 'chart.js';


export interface SurveyChartComponentProps {
  question: SurveyQuestionSummary;
  title?: string | React.ReactElement;
  color?: { normal: string, selected: string };
  afterSelectionChangedHandler?: (newSelection: string) => void;
}

const COLOR_NORMAL = '#65bcaa';
const COLOR_SELECTED = '#66a372';

export const SurveyChart: React.FunctionComponent<SurveyChartComponentProps> = (props: SurveyChartComponentProps) => {
  const [selectedAnswer, setSelectedAnswer] = React.useState(null);

  const question = props.question;

  const chartData: ChartComponentProps = {
    height: 30 + question.answers.length * 40,
    data: (canvas) => {
      const bgs = typeof props.color === 'string' ? props.color
        : question.answers.map((_, idx) => {
          if (selectedAnswer && question.answers[idx].label === selectedAnswer) {
            return props && props.color ? props.color.selected : COLOR_SELECTED;
          }
          return props && props.color ? props.color.normal : COLOR_NORMAL;
        });

      const labelsSort = -1;
      return {
        labels: question.answers.map(a => a.label),
        datasets: [
          {
            data: question.answers
              .sort((a, b) => a.count > b.count
                ? labelsSort
                : a.count < b.count
                  ? -labelsSort : 0)
              .map(a => a.count),
            label: question.question,
            barPercentage: 0.5,
            backgroundColor: bgs,
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
          gridLines: {
              display: false
          },
          ticks: {
            /** Fix to getting the minimum value as origin and thus not visible */
            suggestedMin: Math.floor(Math.min.apply(null, question.answers.map(e => e.count)) * 0.90),
            display: false,
            maxTicksLimit: 3,
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

          const height = chartInstance.chartArea.bottom;
          const left = chartInstance.chartArea.left;
          const width = chartInstance.chartArea.right;
          const steps = chartInstance.data.labels.length;
          const stepH = height / steps;

          const fontNormal = 'normal 12px "Works Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif';
          const fontSelected = 'bold 12px "Works Sans","Helvetica Neue", "Helvetica", "Arial", sans-serif';

          ctx.save();
          ctx.shadowBlur = 3;
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
          ctx.fillStyle = 'var(--slate-gray)';

          const fontSize = ctx.measureText('M').width;
          const textX = left;

          const totalData = chartInstance.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const selectedLegend = chartInstance.options.plugins.legendOnBar.selectdBarLegend();
          for (let i = 0; i < chartInstance.data.labels.length; i++) {
            ctx.font = chartInstance.data.labels[i] === selectedLegend ? fontSelected : fontNormal;
            const textY = (i * stepH) + fontSize;
            const textLabel = chartInstance.data.labels[i] as string;
            const percent = Math.floor((100 * chartInstance.data.datasets[0].data[i]) / totalData);
            chartInstance.ctx.fillText(textLabel, textX, textY, width);

            ctx.font = fontSelected;
            const textPX = width - ctx.measureText(`${percent}%`).width;
            chartInstance.ctx.fillText(`${percent}%`, textPX, textY, width);
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
