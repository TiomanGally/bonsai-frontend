import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {HeaderComponent} from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Balconsai';
}
