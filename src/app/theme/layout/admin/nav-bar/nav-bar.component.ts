// Angular import
import { Component, Output, Input, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavLeftComponent } from './nav-left/nav-left.component';
import { NavRightComponent } from './nav-right/nav-right.component';
import { AlertComponent } from "../../../../alertservice/components/alert/alert.component";

@Component({
  selector: 'app-nav-bar',
  imports: [SharedModule, NavLeftComponent, NavRightComponent, RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: true
})
export class NavBarComponent {
  // Public props
  menuClass: boolean;
  collapseStyle: string;
  windowWidth: number;
  navLeftTheme: string = 'default'; // Store nav-left theme

  // Inputs and Outputs
  @Input() isDarkMode: boolean = false;
  @Output() NavCollapse = new EventEmitter<void>();
  @Output() NavCollapsedMob = new EventEmitter<void>();
  @Output() toggleDarkMode = new EventEmitter<void>();

  constructor() {
    this.menuClass = false;
    this.collapseStyle = 'block'; // Force visibility
    this.windowWidth = window.innerWidth;
    console.log('NavBarComponent initialized, collapseStyle:', this.collapseStyle);
  }
  
  // Public methods
  toggleMobOption() {
    this.menuClass = !this.menuClass;
    this.collapseStyle = this.menuClass ? 'block' : 'none';
  }

  navCollapse() {
    if (this.windowWidth >= 992) {
      this.NavCollapse.emit();
    }
  }

  onNavLeftThemeChange(theme: string) {
    this.navLeftTheme = theme;
  }

  navCollapseMob() {
    if (this.windowWidth < 992) {
      this.NavCollapsedMob.emit();
    }
  }
}