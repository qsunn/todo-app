import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ITodoListItem } from './todo-list.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsModalComponent } from './task-details-modal/task-details-modal.component';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  todoList: ITodoListItem[] = [];
  doneList: ITodoListItem[] = [];

  updateTodoList(name: string) {
    this.todoList.push({name: name, isDeleted: false, index: this.todoList.length});
  }

  deleteTodoTask(idx: number) {
    this.todoList[idx].isDeleted = true;
    setTimeout(() => {
      this.todoList.splice(idx, 1);
      this.todoList[idx].isDeleted = false;
    }, 500)
  }

  deleteDoneTask(idx: number) {
    this.doneList[idx].isDeleted = true;
    setTimeout(() => {
      this.doneList.splice(idx, 1);
      this.doneList[idx].isDeleted = false;
    }, 500)
  }

  clearDoneList() {
    this.doneList.length = 0;
  }

  makeAllDone() {
    this.doneList = this.doneList.concat(this.todoList);
    this.todoList.length = 0;
  }

  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(TaskDetailsModalComponent, {
      maxHeight: '100%',
      width: '300px',
      minHeight: '200px',
      data: {
        todo: this.todoList,
        done: this.doneList
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {
    this.todoList.push({name: 'have fun', isDeleted: false, index: this.todoList.length})
  }

  drop(event: CdkDragDrop<any>) {
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