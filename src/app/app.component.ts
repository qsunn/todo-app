import { Component } from '@angular/core';
import { windowTime } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-app';
  tableToggle: Boolean = true;
  modeToggle: Boolean = true;

  tableToggler(event: Boolean) {
    this.tableToggle = event;
  }

  modeToggler(event: Boolean) {
    this.modeToggle = event;
    if (!this.modeToggle) {
      window.document.body.classList.add('active');
    } else {
      window.document.body.classList.remove('active');
    };
  }
}
