import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ITodoListItem } from '../todo-list/todo-list.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  tasks: ITodoListItem[] = [];

  displayedColumns: String[] = ['position', 'name', 'description', 'importance', 'deadline', 'isCompleted']

  constructor(
    private apiService: ApiService
    ) { }

  ngOnInit(): void {
    this.getAllTasks();
  }

  getAllTasks() {
    this.apiService.getTasks().subscribe(result => {
      this.tasks = result;
    })
  }

}
