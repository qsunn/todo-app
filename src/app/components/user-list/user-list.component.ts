import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../../user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
  })
export class UserListComponent {
    users!: User[];
    displayedColumns: string[] = ['index', 'firstName', 'lastName'];

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }
}