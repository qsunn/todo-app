import { Component } from '@angular/core';
import { TodoListComponent } from './todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-app';
  modeToggle: Boolean = true;
  search: String = '';

  modeToggler(event: Boolean) {
    this.modeToggle = event;
    if (!this.modeToggle) {
      window.document.body.classList.add('my-dark-theme');
    } else {
      window.document.body.classList.remove('my-dark-theme');
    };
  }

  searchResult(event: String) {
    this.search = event;
  }
}
