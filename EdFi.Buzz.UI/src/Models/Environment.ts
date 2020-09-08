export class Environment {
  GQL_ENDPOINT: string;

  GOOGLE_CLIENT_ID?: string;

  ADFS_CLIENT_ID?: string;
  ADFS_TENANT_ID?: string;

  SURVEY_MAX_FILE_SIZE_BYTES: number;
  JOB_STATUS_FINISH_IDS: number[]; /* error and complete status */
}
