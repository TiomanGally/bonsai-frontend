import {Component, inject} from '@angular/core';
import {BackendService} from '../http/backend.service';
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {MatCard, MatCardActions, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatFabButton, MatIconButton} from '@angular/material/button';
import {MatProgressBar} from '@angular/material/progress-bar';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {BonsaiDialogComponent} from '../bonsai-dialog/bonsai-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {QrCodeDialogComponent} from '../qr-code-dialog/qr-code-dialog.component';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {BehaviorSubject, combineLatest, map} from 'rxjs';

@Component({
  selector: 'app-overview',
  imports: [
    NgForOf,
    NgIf,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardActions,
    MatProgressBar,
    RouterLink,
    MatIconButton,
    MatIcon,
    MatFabButton,
    MatTooltip,
    AsyncPipe,
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel,
    CurrencyPipe
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {
  private backendService = inject(BackendService);
  private matDialog = inject(MatDialog);
  bonsais$ = this.backendService.getBonsais()
  readonly name$ = new BehaviorSubject<string>('');
  filteredBonsais$ = combineLatest([this.bonsais$, this.name$]).pipe(
    map(([bonsais, name]) =>
      bonsais.filter(bonsai =>
        bonsai.latinName.toLowerCase().includes(name.toLowerCase()) ||
        bonsai.simpleName?.toLowerCase().includes(name.toLowerCase())
      ))
  )

  openDialog(): void {
    this.matDialog.open(BonsaiDialogComponent);
  }

  showQrCode(bonsaiId: string): void {
    this.matDialog.open(QrCodeDialogComponent, {
      data: {bonsaiId}
    })
  }
}
