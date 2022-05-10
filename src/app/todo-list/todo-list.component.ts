import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
import { debounceTime, finalize } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
    todoList: ITodoListItem[] = [];
    doneList: ITodoListItem[] = [];

    doneCase!: boolean;
    isEmpty!: boolean;

    filteredTodoList: ITodoListItem[] = [];
    filteredDoneList: ITodoListItem[] = [];

    searchControl: FormControl = new FormControl();
    options: string[] = [];
    filteredOptions!: Observable<string[]>;

    private _filter(value: string): string[] {
        return this.options.filter(option => option.toLowerCase().includes(value.toLowerCase()));
    }

    constructor(
        public dialog: MatDialog,
        private apiService: ApiService,
        private snackBar: MatSnackBar
    ) {
        this.searchControl.valueChanges
            .pipe(debounceTime(250))
            .subscribe(changeResult => {
                this.getSearchedTask(changeResult);
            })
    }

    ngOnInit(): void {
        this.getAllTasks();
        this.filteredOptions = this.searchControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)),
        );
    }

    openSnackBar(message: string, action: string, item: ITodoListItem, event: any) {
        let snackBarRef = this.snackBar.open(message, action, {
            duration: 4000,
            panelClass: [message === `Task ${item.name} has been deleted` ? 'snackbar-undo' : 'snackbar']
        });
        snackBarRef.afterDismissed().subscribe((result) => {
            if (result.dismissedByAction && message === `Task ${item.name} has been deleted`) {
                event.target.parentNode.parentNode.classList.remove('hidden');
            } else {
                this.deleteTask(item);
            }
        });
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
                this.openSnackBar(`Task ${item.name} has been edited`, '', item, event);
            }
        });
    }

    openConfirmModal(event: any, doneList: ITodoListItem[]) {
        let text!: string;
        let title!: string;
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
            this.doneCase ? this.deleteCompletedTasks(doneList) : this.makeAllDone();
        });
    }

    getAllTasks() {
        this.apiService.getTasks().subscribe((tasks) => {
            for (let i = 0; i < tasks.length; i++) {
                this.options.push(tasks[i].name);
            }
            if (tasks.length) {
                this.todoList = tasks.filter((item) => !item.isCompleted);
                this.doneList = tasks.filter((item) => item.isCompleted);
            } else {
                this.todoList = [];
                this.doneList = [];
            }
            this.getSearchedTask('');
        });
    }

    getSearchedTask(searchResult: string) {
        this.filteredTodoList = searchResult === '' ? this.todoList : this.todoList.filter(item => item.name.toLowerCase().includes(searchResult.toLowerCase()));
        this.filteredDoneList = searchResult === '' ? this.doneList : this.doneList.filter(item => item.name.toLowerCase().includes(searchResult.toLowerCase()));
    }

    changeIsCompleted(item: ITodoListItem) {
        item.isCompleted = !item.isCompleted;
        this.apiService.updateTask(item.id, item).subscribe((result) => {
            item.isCompleted ? this.openSnackBar(`Task ${item.name} has been moved to done list`, '', item, event) : this.openSnackBar(`Task ${item.name} has been moved back to todo list`, '', item, event)
        });
    }

    hideTask(item: ITodoListItem, event: any) {
        this.openSnackBar(`Task ${item.name} has been deleted`, 'Undo', item, event);
        event.target.parentNode.parentNode.classList.add('hidden');
    }

    deleteTask(item: ITodoListItem) {
        this.apiService.deleteTaskById(item.id).subscribe((result) => {
            item.isDeleted = !item.isDeleted;
        });
    }

    deleteCompletedTasks(doneList: ITodoListItem[]) {
        this.apiService.deleteCompletedTasks().subscribe((result) => {
            doneList.forEach(item => item.isDeleted = !item.isDeleted);
            this.getAllTasks();
            this.openSnackBar(`Done tasks have been deleted`, '', result, event);
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
                    this.openSnackBar(`All tasks have been moved to done list`, '', result, event);
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