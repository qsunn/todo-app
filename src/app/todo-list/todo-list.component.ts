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

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
    todoList: ITodoListItem[] = [];
    doneList: ITodoListItem[] = [];

    task: any;
    id: any;

    constructor(public dialog: MatDialog, private apiService: ApiService) {}

    ngOnInit(): void {
        this.refresh();
    }

    refresh() {
        this.todoList.length = 0;
        this.doneList.length = 0;
        this.getAllTasks();
    }

    openDialog(item: any) {
        const dialogRef = this.dialog.open(TaskDetailsModalComponent, {
            width: '300px',
            data: item
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
            // if (result) {
            //     console.log(item)
            //     this.updateTask(item);
            // }
        });
    }

    getAllTasks() {
        this.apiService.getTasks().subscribe((tasks) => {
            let todoTasks = tasks.filter((item) => !item.isCompleted);
            let doneTasks = tasks.filter((item) => item.isCompleted);
            todoTasks.map((item) => this.todoList.push(item));
            doneTasks.map((item) => this.doneList.push(item));
            console.log(tasks);
        });
    }

    getTask(item: any) {
        this.apiService
            .getTaskById(item.id)
            .subscribe((result) => {
                this.task = result;
                console.log(result);
            });
    }

    updateTask(item: any) {
        this.apiService
            .updateTask(item.id, item)
            .subscribe((result) => {
                item = result;
                console.log(result)
            });
    }

    deleteTask(item: any) {
        console.log(item);
        item.isDeleted = !item.isDeleted;
        this.apiService.deleteTaskById(item.id).subscribe((result) => {
            console.log(result);
            setTimeout(() => {
                this.ngOnInit();
            }, 500)
        })
    }

    deleteAllTasks(items: ITodoListItem[]) {
        items.forEach(item => {
            item.isDeleted = !item.isDeleted;
            this.apiService.deleteTaskById(item.id).subscribe((result) => console.log(result));
        })
        this.refresh()
    }

    makeAllDone() {
        this.todoList.forEach((item) => {
            item.isCompleted = !item.isCompleted;
            this.updateTask(item);
        });
        this.doneList = this.doneList.concat(this.todoList);
        this.todoList.length = 0;
    }

    drop(event: CdkDragDrop<any>) {
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
            event.item.data.isCompleted = !event.item.data.isCompleted;
            this.updateTask(event.item.data);
        }
    }
}
