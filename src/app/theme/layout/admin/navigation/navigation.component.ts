// Angular Import
import { Component, output } from '@angular/core';

// project import
import { NavContentComponent } from './nav-content/nav-content.component';
import { NavigationService } from 'src/app/demo/users/services/navigation.service';
import { UserService } from 'src/app/demo/users/services/user.service';
import { NavigationItem } from './navigation';

@Component({
  selector: 'app-navigation',
  imports: [NavContentComponent],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  windowWidth: number;
    NavMobCollapse = output();
    navigationItems: NavigationItem[] = [];

    constructor(
        private navigationService: NavigationService,
        private userService: UserService
    ) {
        this.windowWidth = window.innerWidth;
    }

    ngOnInit() {
        this.userService.getCurrentUser().subscribe({
            next: (user) => {
                this.userService.setCurrentUser(user);
                this.navigationItems = this.navigationService.getFilteredNavigation();
            },
            error: (err) => console.error('Failed to fetch current user', err)
        });

        this.userService.currentUser$.subscribe(() => {
            this.navigationItems = this.navigationService.getFilteredNavigation();
        });
    }

    navMobCollapse() {
        if (this.windowWidth < 992) {
            this.NavMobCollapse.emit();
        }
    }
}
