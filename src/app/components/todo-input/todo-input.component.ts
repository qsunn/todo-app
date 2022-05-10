import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoListComponent } from 'src/app/todo-list/todo-list.component';
import { ITodoListItem } from 'src/app/todo-list/todo-list.model';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-todo-input',
    templateUrl: './todo-input.component.html',
    styleUrls: ['./todo-input.component.scss'],
})
export class TodoInputComponent implements OnInit {
    @Output() taskCreated: EventEmitter<any> = new EventEmitter();

    inputValue: FormControl;
    today = new Date();
    deadline = new Date();

    constructor(
        private apiService: ApiService,
        private snackBar: MatSnackBar
    ) {
        this.inputValue = new FormControl('', [Validators.required, this.noWhitespaceValidator]);
    }

    ngOnInit(): void { }

    openSnackBar(message: string) {
        this.snackBar.open(message, '', {
            duration: 4000,
            panelClass: ['snackbar']
        });
    }

    clearInput() {
        this.inputValue.setValue('');
    }

    public noWhitespaceValidator(control: FormControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        return !isWhitespace ? null : { 'whitespace': true };
    }

    createTask() {
        if (this.inputValue.valid) {
            this.deadline.setDate(this.today.getDate() + 1);
            let input = {
                name: this.inputValue.value,
                description: '-',
                importance: 'Easy',
                deadline: this.deadline,
                isDeleted: false,
                isCompleted: false,
            };
            this.apiService.createTask(input).subscribe({
                next: result => {
                    this.clearInput();
                    this.taskCreated.emit();
                    this.openSnackBar(`Task ${input.name} has been created`);
                },
                error: error => {
                    console.log('Empty input');
                }
            });
        }
    }
}
