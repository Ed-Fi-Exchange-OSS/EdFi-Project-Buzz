import { ApolloClient, InMemoryCache } from '@apollo/client';
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
    const { data } = await client.query({ query: odssurveys, variables: null, fetchPolicy: 'network-only' });
    const odsSurveyList: OdsSurvey[] = data.odssurveys ? data.odssurveys : [];
    return odsSurveyList;
  };

  public importOdsSurveys = async (odsSurveys: OdsSurvey[]): Promise<LoadSurveyFromOdsResponse> => {
    const client = this.apolloClient;

    const { data } = await client.mutate({
      mutation: loadsurveyfromods,
      variables: {
        staffkey: this.authenticationService.currentUserValue.teacher.staffkey,
        surveylist: odsSurveys.map(odssurvey => ({
          surveyidentifier: odssurvey.surveyidentifier,
          surveytitle: odssurvey.surveytitle
        }))
      }
    });
    const result: LoadSurveyFromOdsResponse = data.loadsurveyfromods ? data.loadsurveyfromods : null;
    return result;
  };

  public getCanLoadSurverysFromUI = async (): Promise<boolean> => {
    const client = this.apolloClient;

    const { data } = await client.query({
      query: canLoadSurverysFromUI,
      fetchPolicy: 'network-only'
    });

    const result: boolean = data.canLoadSurverysFromUI ? data.canLoadSurverysFromUI.allowed : null;
    return result;
  };

  public getDoesOdsContainsSurveyModel = async (): Promise<boolean> => {
    const client = this.apolloClient;

    const { data } = await client.query({
      query: doesOdsContainsSurveyModel,
      fetchPolicy: 'network-only'
    });

    const result: boolean = data.doesOdsContainsSurveyModel ? data.doesOdsContainsSurveyModel.allowed : null;
    return result;
  };
}
