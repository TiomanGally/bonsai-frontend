import {Component} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {BackendService} from '../http/backend.service';

@Component({
  selector: 'app-bonsai-dialog',
  templateUrl: './bonsai-dialog.component.html',
  imports: [
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatDialogActions,
    MatButton,
    MatDialogTitle
  ],
  styleUrls: ['./bonsai-dialog.component.scss']
})
export class BonsaiDialogComponent {
  bonsaiForm: FormGroup;
  qrCode?: string

  constructor(
    private fb: FormBuilder,
    private backendService: BackendService,
    public dialogRef: MatDialogRef<BonsaiDialogComponent>
  ) {
    this.bonsaiForm = this.fb.group({
      latinName: ['', Validators.required],
      simpleName: [''],
      birthDate: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      lastRepoted: ['', Validators.required]
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.bonsaiForm.valid) {
      this.backendService.createBonsai(this.bonsaiForm.value).subscribe((qrCode) => {
        this.qrCode = qrCode;
      });
    }
  }
}
