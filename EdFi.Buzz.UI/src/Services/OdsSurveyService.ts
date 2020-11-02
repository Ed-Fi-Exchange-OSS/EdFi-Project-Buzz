import { ApolloClient, InMemoryCache } from '@apollo/client';
import EnvironmentService from './EnvironmentService';
import OdsSurvey from '../Models/OdsSurvey';
import LoadSurveyFromOdsResponse from '../Models/LoadSurveyFromOdsResponse';
import { odssurveys } from './GraphQL/OdsSurveyQueries';
import { loadsurveyfromods } from './GraphQL/OdsSurveyMutations';
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

    const { data } = await client.query({
      query: loadsurveyfromods,
      variables: {
        staffkey: this.authenticationService.currentUserValue.teacher.staffkey,
        surveylist: odsSurveys.map(odssurvey => ({
          surveyidentifier: odssurvey.surveyidentifier,
          surveytitle: odssurvey.surveytitle
        }))
      },
      fetchPolicy: 'network-only'
    });
    const result: LoadSurveyFromOdsResponse = data.loadsurveyfromods ? data.loadsurveyfromods : null;
    return result;
  };
}
