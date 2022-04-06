import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
    selector: 'app-todo-input',
    templateUrl: './todo-input.component.html',
    styleUrls: ['./todo-input.component.scss'],
})
export class TodoInputComponent implements OnInit {
    @Output() refresh: EventEmitter<any> = new EventEmitter();
    @Output() updateTask: EventEmitter<any> = new EventEmitter();

    inputValue = new FormControl('');
    today = new Date();
    deadline = this.today.setDate(this.today.getDate() + 1);

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {}

    clearInput() {
        this.inputValue.setValue('');
    }

    createTask() {
        let input = {
            name: this.inputValue.value,
            description: 'No description',
            importance: 'option3',
            deadline: this.today,
            isDeleted: false,
            isCompleted: false
        };
        this.apiService
            .createTask(input)
            .subscribe((result) => {
                console.log(result);
            });
        this.clearInput();
        this.refresh.emit();
    }
}
