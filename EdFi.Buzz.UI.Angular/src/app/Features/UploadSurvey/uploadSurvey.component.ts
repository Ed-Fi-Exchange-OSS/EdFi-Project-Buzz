import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { ApiService } from 'src/app/Services/api.service';

interface FileStatus {
  fileName: string;
  isValid: boolean;
  status: string;
  error?: string;
  jobId?: string;
}

@Component({
  selector: 'app-upload-survey',
  templateUrl: './uploadSurvey.component.html',
  styleUrls: ['./uploadSurvey.component.css']
})
export class UploadSurveyComponent {
  currentUserStaffKey: number;

  form: FormGroup;
  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  @ViewChild('UploadFileLabel', { static: false }) uploadFileLabel: ElementRef;
  progress = 0;
  isFileSelected = false;
  isFileUploading = false;
  message: FileStatus;
  readonly SURVEY_MAX_FILE_SIZE: number;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private title: Title
  ) {
    this.SURVEY_MAX_FILE_SIZE = this.api.survey.SURVEY_MAX_FILE_SIZE;
    this.currentUserStaffKey = this.api.authentication.currentUserValue.teacher.staffkey;

    this.title.setTitle('Buzz Upload Survey');
    this.form = this.fb.group({
      surveyName: [null, Validators.required],
      file: [null]
    });
  }


  CheckFileValid(file: File): FileStatus {
    if (!file) {
      return { fileName: '', status: 'ERROR', error: 'No file selected', isValid: false };
    }
    if (file.size > this.SURVEY_MAX_FILE_SIZE) {
      const error = `File size (${ (file.size / 1024.0).toFixed(2) } Kb) must be less than ${(this.SURVEY_MAX_FILE_SIZE / (1024)).toFixed(2)} Kb`;
      const message = { fileName: file.name, status: 'ERROR', error: error, isValid: false };
      return message;
    }
    return { fileName: file.name, status: 'VALID', isValid: true };
  }

  prepareFilesList(files: any) {
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
      .uploadSurvey(this.currentUserStaffKey, title, content)
      .then(value => {
        this.message = { fileName: file.name, status: 'ACCEPTED', isValid: true, jobId: value };
        this.resetControls();
      })
      .catch(reason => {
        this.message = { fileName: file.name, status: 'ERROR', error: reason, isValid: true };
        this.resetControls();
      });
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
