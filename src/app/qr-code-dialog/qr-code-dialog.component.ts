import {Component, inject} from '@angular/core';
import {BackendService} from '../http/backend.service';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-qr-code-dialog',
  imports: [
    MatDialogContent,
    MatButton,
    MatDialogActions,
    AsyncPipe
  ],
  templateUrl: './qr-code-dialog.component.html',
  styleUrl: './qr-code-dialog.component.css'
})
export class QrCodeDialogComponent {
  private data: { bonsaiId: string } = inject(MAT_DIALOG_DATA)
  private backendService = inject(BackendService)
  private qrCodeDialog = inject(MatDialogRef<QrCodeDialogComponent>,)

  imageUrl$: Observable<string> = this.backendService.getQrCodeForBonsai(this.data.bonsaiId);

  close(): void {
    this.qrCodeDialog.close();
  }
}
