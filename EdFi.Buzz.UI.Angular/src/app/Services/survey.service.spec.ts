import { TestBed } from '@angular/core/testing';
import { SurveyService } from './survey.service';
import { Apollo } from 'apollo-angular';
import { EnvironmentService } from './environment.service';
describe('SurveyService', () => {
  /* Needed for EnvironmentService */
  window['tempConfigStorage'] = {
    GQL_ENDPOINT: "Xtest",
    GOOGLE_CLIENT_ID: "Xtest",
    SURVEY_MAX_FILE_SIZE_BYTES: 10
  }
  beforeEach(() => TestBed.configureTestingModule({
    providers: [Apollo, EnvironmentService]
  }));
  it('should be created', () => {
    const service: SurveyService = TestBed.get(SurveyService);
    expect(service).toBeTruthy();
  });
});
