import { Component, OnInit } from '@angular/core';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ITodoListItem } from './todo-list.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsModalComponent } from './task-details-modal/task-details-modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ApiService } from '../services/api.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
    todoList: ITodoListItem[] = [];
    doneList: ITodoListItem[] = [];

    doneCase!: Boolean;
    isEmpty!: Boolean;

    constructor(public dialog: MatDialog, private apiService: ApiService) { }

    ngOnInit(): void {
        this.getAllTasks();
    }

    openDialog(item: ITodoListItem) {
        const dialogRef = this.dialog.open(TaskDetailsModalComponent, {
            width: '300px',
            data: item,
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
            if (result) {
                this.getAllTasks();
            }
        });
    }

    openConfirmModal(event: any, doneList: ITodoListItem[]) {
        let text!: String;
        let title!: String;
        switch (event.target.innerText) {
            case 'Todo': 
                this.doneCase = false;
                this.todoList.length ? this.isEmpty = false : this.isEmpty = true;
                this.isEmpty ? title = 'No tasks' : title = 'Are you sure?';
                this.isEmpty ? text = 'No todo tasks' : text = 'Move all tasks to done';
                break;
            case 'Done':
                this.doneCase = true;
                this.doneList.length ? this.isEmpty = false : this.isEmpty = true;
                this.isEmpty ? title = 'No tasks' : title = 'Are you sure?';
                this.isEmpty ? text = 'No done tasks' : text = 'Delete all done tasks';
                break;
        }

        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '300px',
            data: {
                title: title,
                text: text
            }
        });

        dialogRef.componentInstance.onConfirm.subscribe(result => {
            console.log(`Dialog result: ${result}`);
            this.doneCase ? this.deleteCompletedTasks(doneList) : this.makeAllDone();
        });
    }

    getAllTasks() {
        this.apiService.getTasks().subscribe((tasks) => {
            if (tasks.length) {
                this.todoList = tasks.filter((item) => !item.isCompleted);
                this.doneList = tasks.filter((item) => item.isCompleted);
            } else {
                this.todoList = [];
                this.doneList = [];
            }
        });
    }

    changeIsCompleted(item: ITodoListItem) {
        item.isCompleted = !item.isCompleted;
        this.apiService.updateTask(item.id, item).subscribe((result) => {
            console.log(result);
        });
    }

    deleteTask(item: ITodoListItem) {
        console.log(item);
        this.apiService.deleteTaskById(item.id).subscribe((result) => {
            console.log(result);
            item.isDeleted = !item.isDeleted;
            this.getAllTasks();
        });
    }

    deleteCompletedTasks(doneList: ITodoListItem[]) {
        this.apiService.deleteCompletedTasks().subscribe((result) => {
            doneList.forEach(item => item.isDeleted = !item.isDeleted);
            this.getAllTasks();
        });
    }

    makeAllDone() {
        this.apiService
            .makeAllDone()
            .pipe(finalize(() => {
                console.log('pipe (finalize)')
            }))
            .subscribe({
                next: result => {
                    this.getAllTasks();
                    console.log('subscribe (result)')
                },
                error: error => {
                    console.log('subscribe (error)')
                },
                complete: () => {
                    console.log('subscribe (complete)')
                }
            });
    }

    drop(event: CdkDragDrop<ITodoListItem[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
            this.changeIsCompleted(event.item.data);
        }
    }
}
