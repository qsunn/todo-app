import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-input',
  templateUrl: './todo-input.component.html',
  styleUrls: ['./todo-input.component.scss'],
})
export class TodoInputComponent implements OnInit {
  
  inputValue: string = '';

  @Output() onAddItem: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  addItem() {
    this.inputValue.trim() ? this.onAddItem.emit(this.inputValue) : alert('wrong input');
    this.inputValue = '';
  }
}
