import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() modeTogglerResult: EventEmitter<Boolean> = new EventEmitter();

  tableToggle: Boolean = true;
  usersToggle: Boolean = true;
  modeToggle: Boolean = true;
  currentUser!: User;
  
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
  }

  tableToggler() {
    this.tableToggle = !this.tableToggle;
    this.usersToggle = true;
  }

  modeToggler() {
    this.modeToggle = !this.modeToggle;
    this.modeTogglerResult.emit(this.modeToggle);
  }

  usersToggler() {
    this.usersToggle = !this.usersToggle;
    this.tableToggle = true;
  }

  iconsReset() {
    this.usersToggle = true;
    this.tableToggle = true;
  }

}
