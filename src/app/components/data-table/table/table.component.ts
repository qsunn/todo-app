import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ITodoListItem } from 'src/app/todo-list/todo-list.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit {

  @Input() tasks!: ITodoListItem[];

  dataSource: MatTableDataSource<ITodoListItem> = new MatTableDataSource<ITodoListItem>();

  displayedColumns: string[] = ['position', 'name', 'description', 'importance', 'deadline', 'isCompleted', 'id'];

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor() { }

  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource<ITodoListItem>(this.tasks);
    this.dataSource.paginator = this.paginator;
  }

}
