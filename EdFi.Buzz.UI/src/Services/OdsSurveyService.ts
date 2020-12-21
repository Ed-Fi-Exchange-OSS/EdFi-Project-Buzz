import { ApolloClient, InMemoryCache } from '@apollo/client';
import { trackPromise } from 'react-promise-tracker';
import EnvironmentService from './EnvironmentService';
import OdsSurvey from '../Models/OdsSurvey';
import LoadSurveyFromOdsResponse from '../Models/LoadSurveyFromOdsResponse';
import { odssurveys, canLoadSurverysFromUI, doesOdsContainsSurveyModel } from './GraphQL/OdsSurveyQueries';
import { loadsurveyfromods  } from './GraphQL/OdsSurveyMutations';
import AuthenticationService from './AuthenticationService';

export default class OdsSurveyService{

  constructor(
    private env: EnvironmentService,
    private apolloClient: ApolloClient<InMemoryCache>,
    private authenticationService: AuthenticationService) {
  }

  public getOdsSurvey = async (): Promise<OdsSurvey[]> => {
    const client = this.apolloClient;
    let odsSurveyList: OdsSurvey[];
    await trackPromise(client
      .query({
        query: odssurveys,
        variables: null,
        fetchPolicy: 'network-only' })
      .then(response => {
        odsSurveyList = response.data.odssurveys ? response.data.odssurveys : [];
      }));
    return odsSurveyList;
  };

  public importOdsSurveys = async (odsSurveys: OdsSurvey[]): Promise<LoadSurveyFromOdsResponse> => {
    const client = this.apolloClient;
    let result: LoadSurveyFromOdsResponse = null;
    await trackPromise(client
      .mutate({
        mutation: loadsurveyfromods,
        variables: {
          staffkey: this.authenticationService.currentUserValue.teacher.staffkey,
          surveylist: odsSurveys.map(odssurvey => ({
            surveyidentifier: odssurvey.surveyidentifier,
            surveytitle: odssurvey.surveytitle
          }))
        }
      })
      .then(response => {
        result = response.data.loadsurveyfromods ? response.data.loadsurveyfromods : null;
      }));
    return result;
  };

  public getCanLoadSurverysFromUI = async (): Promise<boolean> => {
    const client = this.apolloClient;
    let result: boolean = null;
    await trackPromise(client
      .query({
        query: canLoadSurverysFromUI,
        fetchPolicy: 'network-only'
      })
      .then(response => {
        result = response.data.canLoadSurverysFromUI ? response.data.canLoadSurverysFromUI : null;
      }));
    return result;
  };

  public getDoesOdsContainsSurveyModel = async (): Promise<boolean> => {
    const client = this.apolloClient;
    let result: boolean = null;
    await trackPromise(client.query({
      query: doesOdsContainsSurveyModel,
      fetchPolicy: 'network-only'
    })
      .then(response => {
        result = response.data.doesOdsContainsSurveyModel ? response.data.doesOdsContainsSurveyModel : null;
      }));
    return result;
  };
}
