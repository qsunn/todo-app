import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { ITodoListItem } from '../../todo-list/todo-list.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  tasks: MatTableDataSource<ITodoListItem> = new MatTableDataSource<ITodoListItem>();
  allTasks: MatTableDataSource<ITodoListItem> = new MatTableDataSource<ITodoListItem>();

  length!: number;

  tabs = [{
    name: 'All',
    data: new Array<ITodoListItem>()
  }, {
    name: 'Easy',
    data: new Array<ITodoListItem>()
  }, {
    name: 'Medium',
    data: new Array<ITodoListItem>()
  }, {
    name: 'Strong',
    data: new Array<ITodoListItem>()
  }];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.getAllTasks();
  }

  getAllTasks() {
    this.apiService.getTasks().subscribe(result => {
      result.length ? this.tasks = new MatTableDataSource<ITodoListItem>(result) : console.log('no tasks');
      this.tabs[0].data = result;
      this.tabs[1].data = result.filter(item => item.importance === 'Easy');
      this.tabs[2].data = result.filter(item => item.importance === 'Medium');
      this.tabs[3].data = result.filter(item => item.importance === 'Strong');
    })
  }

}
