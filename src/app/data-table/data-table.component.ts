import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../service/api.service';
import { ITodoListItem } from '../todo-list/todo-list.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  tasks: MatTableDataSource<ITodoListItem> = new MatTableDataSource<ITodoListItem>();
  displayedColumns: String[] = ['position', 'name', 'description', 'importance', 'deadline', 'isCompleted', 'id'];
  length!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.getAllTasks();
  }

  getAllTasks() {
    this.apiService.getTasks().subscribe(result => {
      result.length ? this.tasks = new MatTableDataSource<ITodoListItem>(result) : console.log('no tasks');
      this.length = result.length;
      this.tasks.paginator = this.paginator;
    })
  }

}
