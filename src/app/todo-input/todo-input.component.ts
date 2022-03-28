import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-input',
  templateUrl: './todo-input.component.html',
  styleUrls: ['./todo-input.component.scss']
})
export class TodoInputComponent implements OnInit {

  inputValue: string = '';

  @Output() onAddItem: EventEmitter<string> = new EventEmitter();

  addItem() {
    this.onAddItem.emit(this.inputValue);
    this.inputValue = '';
  }

  constructor() { }

  ngOnInit(): void {
  }

}
