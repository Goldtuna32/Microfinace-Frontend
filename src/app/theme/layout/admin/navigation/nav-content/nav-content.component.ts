// angular import
import { Component, OnInit, inject, output } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';

// project import
import { environment } from 'src/environments/environment';
import { NavigationItem, NavigationItems } from '../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavCollapseComponent } from './nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './nav-group/nav-group.component';
import { NavItemComponent } from './nav-item/nav-item.component';
import { NavigationService } from 'src/app/demo/users/services/navigation.service';
import { UserService } from 'src/app/demo/users/services/user.service';

@Component({
  selector: 'app-nav-content',
  imports: [SharedModule, NavCollapseComponent, NavGroupComponent, NavItemComponent],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  private location = inject(Location);
  private locationStrategy = inject(LocationStrategy);
  private navigationService = inject(NavigationService);
  private userService = inject(UserService);

  // Version
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  // Public props
  navigations: NavigationItem[] = [];
  wrapperWidth!: number;
  windowWidth: number;

  NavMobCollapse = output();

  constructor() {
      this.windowWidth = window.innerWidth;
  }

  ngOnInit() {
      this.userService.getCurrentUser().subscribe({
          next: (user) => {
              this.userService.setCurrentUser(user);
              this.navigations = this.navigationService.getFilteredNavigation();
          },
          error: (err) => console.error('Failed to fetch current user', err)
      });

      this.userService.currentUser$.subscribe(() => {
          this.navigations = this.navigationService.getFilteredNavigation();
      });

      if (this.windowWidth < 992) {
          document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
      }
  }

  navMob() {
      if (this.windowWidth < 992 && document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
          this.NavMobCollapse.emit();
      }
  }

  fireOutClick() {
      let current_url = this.location.path();
      const baseHref = this.locationStrategy.getBaseHref();
      if (baseHref) {
          current_url = baseHref + this.location.path();
      }
      const link = "a.nav-link[ href='" + current_url + "' ]";
      const ele = document.querySelector(link);
      if (ele !== null && ele !== undefined) {
          const parent = ele.parentElement;
          const up_parent = parent?.parentElement?.parentElement;
          const last_parent = up_parent?.parentElement;
          if (parent?.classList.contains('pcoded-hasmenu')) {
              parent.classList.add('pcoded-trigger');
              parent.classList.add('active');
          } else if (up_parent?.classList.contains('pcoded-hasmenu')) {
              up_parent.classList.add('pcoded-trigger');
              up_parent.classList.add('active');
          } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
              last_parent.classList.add('pcoded-trigger');
              last_parent.classList.add('active');
          }
      }
  }
}
