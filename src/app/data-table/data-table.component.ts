import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../service/api.service';
import { ITodoListItem } from '../todo-list/todo-list.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, AfterViewInit {

  tasks: MatTableDataSource<ITodoListItem> = new MatTableDataSource<ITodoListItem>();
  displayedColumns: String[] = ['position', 'name', 'description', 'importance', 'deadline', 'isCompleted', 'id'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.getAllTasks();
  }

  ngAfterViewInit() {
    this.tasks.paginator = this.paginator;
  }

  getAllTasks() {
    this.apiService.getTasks().subscribe(result => {
      result.length ? this.tasks = new MatTableDataSource<ITodoListItem>(result) : console.log('no tasks');
    })
  }

}
