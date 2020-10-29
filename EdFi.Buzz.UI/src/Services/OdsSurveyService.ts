import { ApolloClient, InMemoryCache } from '@apollo/client';
import EnvironmentService from './EnvironmentService';
import OdsSurvey from '../Models/OdsSurvey';
import { odssurveys } from './GraphQL/OdsSurveyQueries';

export default class OdsSurveyService{
  
  constructor(private env: EnvironmentService, private apolloClient: ApolloClient<InMemoryCache>) {
    
  }

  public getOdsSurvey = async (): Promise<OdsSurvey[]> => {
    const client = this.apolloClient;
    const { data } = await client.query({ query: odssurveys, variables: null, fetchPolicy: 'network-only' });
    let odsSurveyList: OdsSurvey[] = data.odssurveys ? data.odssurveys : [];
    return odsSurveyList;
  };
}
