import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  todoList:string[] = [];
  doneList:string[] = [];

  updateTodoList(name: string) {
    this.todoList.push(name)
  }

  constructor() { }

  ngOnInit(): void {
  }

}
