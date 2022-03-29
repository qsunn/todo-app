import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  todoList: string[] = [];
  doneList: string[] = [];
  idx!: number;

  updateTodoList(name: string) {
    this.todoList.push(name);
  }

  deleteTodoTask() {
    this.todoList.splice(this.idx, 1);
  }

  deleteDoneTask() {
    this.doneList.splice(this.idx, 1);
  }

  clearDoneList() {
    this.doneList.length = 0;
  }

  makeAllDone() {
    this.doneList = this.doneList.concat(this.todoList);
    this.todoList.length = 0;
  }

  constructor() { }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}
