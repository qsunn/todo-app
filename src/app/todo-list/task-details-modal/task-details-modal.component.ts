import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITodoListItem } from '../todo-list.model';

@Component({
  selector: 'app-task-details-modal',
  templateUrl: './task-details-modal.component.html',
  styleUrls: ['./task-details-modal.component.scss']
})
export class TaskDetailsModalComponent implements OnInit {

  isEditorMode = false;
  taskName = 'Task Name';
  description = 'Description';
  importance = 'option3';
  today = new Date();

  taskForm = this.fb.group({
    name: [this.taskName, Validators.minLength(1)],
    description: [this.description],
    importance: [this.importance],
    deadline: [this.today],
    taskData: this.fb.array([
      this.fb.control('')
    ])
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {todo: ITodoListItem[], done: ITodoListItem[]},
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
  }

  editorModeChange(): void {
    this.isEditorMode = !this.isEditorMode;
  }

  updateTask() {
    console.log(this.taskForm.value)
    // this.apiService.updateTask(this.taskForm ,this.taskForm.getRawValue()).subscribe(result => {
    //   console.log(result)
    // })
  }

  get name() {
    return this.taskForm.get("name")
  }

  get taskData() {
    return this.taskForm.get('taskData') as FormArray;
  }

  addTaskData() {
    this.taskData.push(this.fb.control(''));
  }
  
}
