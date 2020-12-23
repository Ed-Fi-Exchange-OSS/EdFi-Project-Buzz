import { ApolloClient, InMemoryCache } from '@apollo/client';
import Environment from 'Models/Environment';
import { trackPromise } from 'react-promise-tracker';
import { uploadSurvey , deleteSurvey } from './GraphQL/SurveyMutations';
import EnvironmentService from './EnvironmentService';
import Survey from '../Models/Survey';
import SurveyStatus from '../Models/SurveyStatus';
import { getSurveyStatus } from './GraphQL/SurveyQueries';

export default class SurveyService{
  public environment: Environment;

  public readonly JOB_STATUS_FINISH_IDS: number[];

  public readonly SURVEY_MAX_FILE_SIZE_BYTES: number;

  constructor(private env: EnvironmentService, private apolloClient: ApolloClient<InMemoryCache>) {
    this.SURVEY_MAX_FILE_SIZE_BYTES = Number(env.environment.SURVEY_MAX_FILE_SIZE_BYTES);
    this.JOB_STATUS_FINISH_IDS = this.env.environment.JOB_STATUS_FINISH_IDS;
  }

  public uploadSurvey = (staffKey: number,
    title: string,
    content: string,
    surveykey: number): Promise<SurveyStatus|null> =>{
    if (content.length > this.SURVEY_MAX_FILE_SIZE_BYTES) {
      Promise.reject(new Error(`Encoded file size (
        ${(content.length / 1024.0).toFixed(2)}) must be less than
        ${(this.SURVEY_MAX_FILE_SIZE_BYTES / 1024.0).toFixed(2)} Kb`));
      return null;
    }
    const client = this.apolloClient;
    return client
      .mutate({ mutation: uploadSurvey, variables: { staffkey: staffKey, content, title, surveykey } })
      .then(result => result.data.uploadsurvey);
  };

  public getSurveyStatus = async (staffKey: number, jobKey: string): Promise<SurveyStatus[]> => {
    const client = this.apolloClient;
    let surveyStatusList: SurveyStatus[] = [];
    await trackPromise(client
      .query(
        {
          query: getSurveyStatus,
          variables: { staffKey, jobKey },
          fetchPolicy: 'network-only' }
      )
      .then(response => {
        surveyStatusList = response.data.surveystatus
          ? response.data.surveystatus
          : [];
      }));
    surveyStatusList = surveyStatusList.map((_item) => {
      const item = { ..._item}; // decouple instance
      if (surveyStatusList) {
        try {
          item.resultSummaryObj = JSON.parse(item.resultsummary).result;
        } catch {}
      }
      return item; // replace original with new instance
    });
    return surveyStatusList;
  };

  public deleteSurvey= async (staffKey: number, surveyKey: number): Promise<Survey> => {
    const client = this.apolloClient;
    return client.mutate(
      {
        mutation: deleteSurvey,
        variables: { staffkey: staffKey , surveykey: surveyKey } })
      .then(result =>  result.data.deletesurvey);
  };
}
