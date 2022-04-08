import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
    selector: 'app-todo-input',
    templateUrl: './todo-input.component.html',
    styleUrls: ['./todo-input.component.scss'],
})
export class TodoInputComponent implements OnInit {
    @Output() taskCreated: EventEmitter<any> = new EventEmitter();

    inputValue = new FormControl('');
    today = new Date();
    deadline = new Date();


    constructor(private apiService: ApiService) {}

    ngOnInit(): void {}

    clearInput() {
        this.inputValue.setValue('');
    }

    createTask() {
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
            console.log(result);
            this.clearInput();
            this.taskCreated.emit();
            },
            error: error => {
                console.log('Empty input');
            }
        });
    }
}
