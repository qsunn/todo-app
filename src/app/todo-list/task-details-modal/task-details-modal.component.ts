import { Component, OnInit, Inject, Input, Output } from '@angular/core';
import {
    FormGroup,
    FormControl,
    Validators,
    FormBuilder,
    FormArray,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/service/api.service';
import { ITodoListItem } from '../todo-list.model';

@Component({
    selector: 'app-task-details-modal',
    templateUrl: './task-details-modal.component.html',
    styleUrls: ['./task-details-modal.component.scss'],
})
export class TaskDetailsModalComponent implements OnInit {
    isEditorMode = false;
    today = new Date();

    taskForm = this.fb.group({
        name: [this.data.name, Validators.minLength(1)],
        description: [this.data.description],
        importance: [this.data.importance],
        deadline: [this.data.deadline],
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ITodoListItem,
        private fb: FormBuilder,
        private apiService: ApiService
    ) {}

    ngOnInit(): void {}

    editorModeChange(): void {
        this.isEditorMode = !this.isEditorMode;
    }

    updateTask(item: any) {
        this.apiService
            .updateTask(item.id, this.taskForm.value)
            .subscribe((result) => {
                console.log(result)
            });
        window.location.reload();
    }

    get name() {
        return this.taskForm.get('name');
    }
}
