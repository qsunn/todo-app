import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() tableToggleResult: EventEmitter<Boolean> = new EventEmitter();
  @Output() modeToggleResult: EventEmitter<Boolean> = new EventEmitter();

  tableToggle: Boolean = true;
  modeToggle: Boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  tableToggler() {
    this.tableToggle = !this.tableToggle;
    this.tableToggleResult.emit(this.tableToggle);
  }

  modeToggler() {
    this.modeToggle = !this.modeToggle;
    this.modeToggleResult.emit(this.modeToggle);
  }

}
