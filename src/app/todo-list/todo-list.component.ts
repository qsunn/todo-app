import { Component, OnInit } from '@angular/core';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ITodoListItem } from './todo-list.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsModalComponent } from './task-details-modal/task-details-modal.component';
import { ApiService } from '../service/api.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
    todoList: ITodoListItem[] = [];
    doneList: ITodoListItem[] = [];

    task!: ITodoListItem;

    constructor(public dialog: MatDialog, private apiService: ApiService) {}

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

    getAllTasks() {
        this.apiService.getTasks().subscribe((tasks) => {
            if (tasks.length) {
                this.todoList = tasks.filter((item) => !item.isCompleted);
                this.doneList = tasks.filter((item) => item.isCompleted);
            } else {
                this.todoList = [];
                this.doneList = [];
            }
            console.log(tasks);
        });
    }

    getTask(item: ITodoListItem) {
        this.apiService.getTaskById(item.id).subscribe((result) => {
            this.task = result;
            console.log(result);
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
            setTimeout(() => {
                this.getAllTasks();
            }, 500);
        });
    }

    deleteAllTasks() {
        this.apiService.deleteAllTasks().subscribe((result) => {
            console.log(result);
            this.getAllTasks();
        });
    }

    makeAllDone() {
        this.apiService
            .markAllDone()
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
