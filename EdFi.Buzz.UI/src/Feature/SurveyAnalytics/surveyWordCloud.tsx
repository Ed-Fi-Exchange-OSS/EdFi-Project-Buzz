import React, { useEffect, useState } from 'react';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import SurveyQuestionSummary from 'Models/SurveyQuestionSummary';

export interface SurveyWordCloudProps {
  title?: string | React.ReactElement;
  question: SurveyQuestionSummary;
}

const SurveyWordCloud: React.FunctionComponent<SurveyWordCloudProps> = (props: SurveyWordCloudProps) => {
  const {question} = props;
  const [data,setData] = useState([]);

  useEffect(() => {
    const answers = question.answers.map(k =>
      ({text: k.label, value:k.count})
    );
    setData(answers);
  }, [question.answers]);
  const callbacks =  {
    getWordTooltip: word => `<b>${word.text}</b><p>${question.question}: ${word.value}</p>`
  };
  return <>
    {(props.title) && <h2>{props.title}</h2>}
    <div className='row'>
      <div className='col-12'>
        <ReactWordcloud options={{
          colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
          enableTooltip: true,
          deterministic: true,
          fontFamily: 'impact',
          fontSizes: [10, 60],
          fontStyle: 'normal',
          fontWeight: 'normal',
          padding: 1,
          rotations: 3,
          rotationAngles: [-90, 0],
          scale: 'sqrt',
          spiral: 'archimedean',
          svgAttributes: {
            role: 'list'
          },
          textAttributes: {
            'aria-label': word => `Word: '${word.text}', Count: '${word.value}'`,
            role: 'img'
          },
          tooltipOptions: {
            allowHTML: true,
            arrow: true,
            placement: 'bottom'
          },
          transitionDuration: 0
        }} words={data}
        callbacks={callbacks}
        />
      </div>
    </div>
  </>;
};

export default SurveyWordCloud;

