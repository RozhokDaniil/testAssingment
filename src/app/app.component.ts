import { Component } from '@angular/core';
import { TableComponent } from './components/table/table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {
  
}
