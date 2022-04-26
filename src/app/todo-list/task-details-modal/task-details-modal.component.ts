import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ITodoListItem } from '../todo-list.model';

@Component({
    selector: 'app-task-details-modal',
    templateUrl: './task-details-modal.component.html',
    styleUrls: ['./task-details-modal.component.scss'],
})
export class TaskDetailsModalComponent implements OnInit {
    isEditorMode = false;
    today = new Date();
    taskForm: FormGroup;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ITodoListItem,
        private fb: FormBuilder,
        private apiService: ApiService
    ) {
        this.taskForm = this.fb.group({
            name: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
            description: new FormControl(''),
            importance: new FormControl(''),
            deadline: new FormControl(''),
        });
    }

    ngOnInit(): void {
        if (this.data) {
            this.setFormValue();
        }
    }

    public noWhitespaceValidator(control: FormControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        return !isWhitespace ? null : { 'whitespace': true };
    }

    setFormValue() {
        this.taskForm.setValue({
            name: this.data.name,
            description: this.data.description,
            importance: this.data.importance,
            deadline: this.data.deadline
        })
    }

    editorModeChange(): void {
        this.isEditorMode = !this.isEditorMode;
    }

    updateTask(item: ITodoListItem) {
        this.apiService.updateTask(item.id, this.taskForm.value).subscribe((result) => {
            console.log(result);
        });
    }

}
