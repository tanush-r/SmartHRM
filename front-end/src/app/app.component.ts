import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PrimeNGConfig } from 'primeng/api';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mvp-1';
}
