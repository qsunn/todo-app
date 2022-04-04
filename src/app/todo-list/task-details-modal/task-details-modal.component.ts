import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITodoListItem } from '../todo-list.model';

interface IImportance {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-task-details-modal',
  templateUrl: './task-details-modal.component.html',
  styleUrls: ['./task-details-modal.component.scss']
})
export class TaskDetailsModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {todo: ITodoListItem[], done: ITodoListItem[]}) { }

  ngOnInit(): void {
  }

  isEditorMode = false;
  taskName = 'Task Name';
  description = 'Description';
  importance = 'option3';
  today = new Date();

  editorModeChange(): void {
    this.isEditorMode = !this.isEditorMode;
  }
  
}
