import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ApiService } from 'src/app/Services/api.service';
import { SurveyStatus } from 'src/app/Models/survey';
import { Router, NavigationStart, Event, ActivatedRoute } from '@angular/router';

interface FileStatus {
  fileName: string;
  isValid: boolean;
  status: string;
  error?: string;
  jobId?: string;
  serverJobStatus?: SurveyStatus;
}

@Component({
  selector: 'app-upload-survey',
  templateUrl: './uploadSurvey.component.html',
  styleUrls: ['./uploadSurvey.component.css']
})
export class UploadSurveyComponent implements OnInit {
  readonly SURVEY_STATUS_QUERY_TIME_IN_MS = 5000; /* 5 seconts intervals */
  readonly SURVEY_MAX_FILE_SIZE_BYTES: number;
  readonly storage: Storage;

  currentUserStaffKey: number;

  private surveyList: SurveyStatus[];

  /// surveyToUpdate null indicates this is not an update, but a normal survey upload.
  private surveyToUpdate: SurveyStatus = null;
  form: FormGroup;
  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  @ViewChild('UploadFileLabel', { static: false }) uploadFileLabel: ElementRef;
  progress = 0;
  isFileSelected = false;
  isFileUploading = false;
  message: FileStatus;

  getJobStatusTimer: number;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.storage = sessionStorage;
    this.SURVEY_MAX_FILE_SIZE_BYTES = this.api.survey.SURVEY_MAX_FILE_SIZE_BYTES;
    this.currentUserStaffKey = this.api.authentication.currentUserValue.teacher.staffkey;

    this.title.setTitle('Buzz Upload Survey');
    this.form = this.fb.group({
      surveyName: [null, Validators.required],
      file: [null]
    });

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        /* clear if there is a timeout waiting */
        this.cancelUploadStatusChecking();
      }
    });
  }

  private cancelUploadStatusChecking() {
    if (this.getJobStatusTimer) {
      clearTimeout(this.getJobStatusTimer);
      this.getJobStatusTimer = null;
    }
  }

  async ngOnInit() {
    this.message = this.loadLastUploadedSurvey();

    this.surveyList = await this.api.survey.getSurveyStatus(
      this.api.authentication.currentUserValue.teacher.staffkey, null);

    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('id')) {
        this.surveyToUpdate = this.surveyList.find(el => el.surveykey === +params.get('id'));
      }
    });
  }

  loadLastUploadedSurvey() {
    const message = JSON.parse(this.storage.getItem('lastUploadedSurvey'));
    if (message && message.serverJobStatus && !this.api.survey.JOB_STATUS_FINISH_IDS.includes(message.serverJobStatus.jobstatuskey)) {
      this.GetJobStatus(message.serverJobStatus.staffkey, message.serverJobStatus.jobkey);
    }
    return message;
  }
  saveLastUploadedSurvey(message: FileStatus) {
    this.storage.setItem('lastUploadedSurvey', JSON.stringify(message));
  }

  CheckFileValid(file: File): FileStatus {
    if (!file) {
      return { fileName: '', status: 'ERROR', error: 'No file selected', isValid: false };
    }
    if (file.size > this.SURVEY_MAX_FILE_SIZE_BYTES) {
      const error = `File size (${(file.size / 1024.0).toFixed(2)} Kb) must be less than ${(this.SURVEY_MAX_FILE_SIZE_BYTES / (1024)).toFixed(2)} Kb`;
      const message = { fileName: file.name, status: 'ERROR', error: error, isValid: false };
      return message;
    }
    return { fileName: file.name, status: 'VALID', isValid: true };
  }

  prepareFilesList(files: any) {
    this.cancelUploadStatusChecking();
    const file = files[0];
    const status = this.CheckFileValid(file);
    if (!status.isValid) {
      this.message = status;
      return;
    }
    this.message = null;

    this.uploadFileLabel.nativeElement.textContent = file.name;

    this.form.patchValue({ file: file });
    this.form.get('file').updateValueAndValidity();
    this.isFileSelected = this.form.value != null;
  }

  onFileDropped(files) {
    this.prepareFilesList(files);
  }

  onSelectSurvey(event) {
    this.prepareFilesList((event.target as HTMLInputElement).files);
  }

  async submitSurvey() {
    const file = this.form.value.file as File;
    const status = this.CheckFileValid(file);
    if (!status.isValid) {
      this.message = status;
      return;
    }

    this.isFileUploading = true;
    const title = this.form.controls['surveyName'].value;
    const content = await this.getFileContentAsBase64(file);

    this.api.survey
      .uploadSurvey(this.currentUserStaffKey, title, content, this.surveyToUpdate ? this.surveyToUpdate.surveykey : null)
      .then(value => {
        this.message = {
          fileName: file.name,
          status: 'ACCEPTED',
          isValid: true,
          serverJobStatus: value
        };
        this.resetControls();
        if (!this.api.survey.JOB_STATUS_FINISH_IDS.includes(value.jobstatuskey)) {
          /* Job is not finished */
          this.getJobStatusTimer = window.setTimeout(
            () => this.GetJobStatus(value.staffkey, value.jobkey),
            this.SURVEY_STATUS_QUERY_TIME_IN_MS);
        }
      })
      .catch(reason => {
        this.message = { fileName: file.name, status: 'ERROR', error: reason, isValid: true };
        this.resetControls();
      });
  }

  async GetJobStatus(staffkey: number, jobkey: string) {
    const values = await this.api.survey.getSurveyStatus(staffkey, jobkey);
    const value = values.length > 0 ? values[0] : null;
    if (!this.message) {
      /* If message don't have value, don't try to check file status. Probably
      the user selected a new file to upload. */
      return;
    }
    this.message.serverJobStatus = value;
    this.saveLastUploadedSurvey(this.message);
    this.getJobStatusTimer = null;
    if (value && !this.api.survey.JOB_STATUS_FINISH_IDS.includes(value.jobstatuskey)) {
      /* Job is not finished */
      this.getJobStatusTimer = window.setTimeout(
        () => this.GetJobStatus(value.staffkey, value.jobkey),
        this.SURVEY_STATUS_QUERY_TIME_IN_MS);
    }
  }

  getFileContentAsBase64(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = () => {
        reader.abort();
        reject(new DOMException('Problem parsing input file.'));
      };

      reader.onload = () => {
        resolve(btoa(reader.result as string));
      };

      reader.readAsBinaryString(file);
    });
  }

  private resetControls() {
    this.progress = 0;
    this.isFileSelected = false;
    this.isFileUploading = false;

    this.form.reset();
    this.uploadFileInput.nativeElement.value = '';
    this.uploadFileLabel.nativeElement.innerText = 'Choose survey file';
  }
}
