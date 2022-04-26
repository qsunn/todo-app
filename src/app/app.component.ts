import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-app';
  modeToggle: Boolean = true;

  modeToggler(event: Boolean) {
    this.modeToggle = event;
    if (!this.modeToggle) {
      window.document.body.classList.add('active');
    } else {
      window.document.body.classList.remove('active');
    };
  }
}
