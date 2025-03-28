import { Injectable } from '@angular/core';
import { NavigationItem, NavigationItems } from 'src/app/theme/layout/admin/navigation/navigation';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private userService: UserService) {}

  private defaultPermissions: string[] = [
    'DASHBOARD_READ',
    'BRANCH_CREATE',
    'ROLE_CREATE',
    'BRANCH_CREATE',
    'BRANCH_READ',
    'CIF_READ',
    'CIF_CREATE',
    'CURRENT_ACCOUNT_READ',
    'TRANSACTION_READ',
    'COLLATERAL_TYPE_READ',
    'COLLATERAL_TYPE_CREATE',
    'COLLATERAL_READ',
    'COLLATERAL_CREATE',
    'LOAN_READ',
    'LOAN_CREATE',
    'DEALER_READ',
    'DEALER_CREATE',
    'PRODUCT_TYPE_READ',
    'PRODUCT_TYPE_CREATE',
    'HP_PRODUCT_READ',
    'HP_PRODUCT_CREATE',
    'UI_COMPONENT_READ',
    'AUTH_SIGNUP',
    'AUTH_SIGNIN',
    'BRANCH_CREATE',
    'CHART_READ',
    'FORMS_READ',
    'TABLES_READ',
    'SAMPLE_PAGE_READ',
    'MENU_LEVEL_READ'
  ];

  getFilteredNavigation(): NavigationItem[] {
    const user = this.userService.currentUserSubject.value;

    let permissions: string[];
    if (!user || !user.permissions) {
      console.log('No user or permissions found, using default permissions');
      permissions = this.defaultPermissions; // Use default permissions
    } else {
      permissions = user.permissions.map(p => `${p.permissionFunction}_${p.name}`); // e.g., CIF_READ
      console.log('User permissions:', permissions);
    }

    return this.filterNavigationItems(NavigationItems, permissions);
  }

  
  private filterNavigationItems(items: NavigationItem[], permissions: string[]): NavigationItem[] {
    return items
      .map(item => {
        const filteredItem = { ...item };
        if (item.children) {
          filteredItem.children = this.filterNavigationItems(item.children, permissions);
          if (filteredItem.children.length === 0) {
            return null; // Remove groups/collapses with no visible children
          }
        } else if (item.url) {
          const requiredPermission = this.getRequiredPermission(item.url);
          if (requiredPermission && !permissions.includes(requiredPermission)) {
            return null; // Remove item if user lacks permission
          }
          // If requiredPermission is null, it's a frontend-only route, so don't filter it out
        }
        return filteredItem;
      })
      .filter(item => item !== null) as NavigationItem[];
  }

  private getRequiredPermission(url: string): string | null {
    const permissionMap: { [key: string]: string | null } = {
      '/analytics': 'BRANCH_CREATE', // Frontend-only, no permission check
      '/create-user': 'BRANCH_CREATE',
      '/users': 'BRANCH_CREATE',
      '/hp-registration': 'BRANCH_CREATE',
      '/hp-registration/list': 'BRANCH_CREATE',
      '/create-role': 'ROLE_CREATE',
      '/branch/create': 'BRANCH_CREATE',
      '/branch/list': 'BRANCH_READ',
      '/cif/list': 'CIF_READ',
      '/cif/create': 'CIF_CREATE',
      '/current-account/list': 'CURRENT_ACCOUNT_READ',
      '/transaction': 'TRANSACTION_READ',
      '/collateralType/list': 'COLLATERAL_TYPE_READ',
      '/create-role-permission': 'BRANCH_CREATE',
      '/role-permissions': 'BRANCH_CREATE',
      '/collateralType/create': 'COLLATERAL_TYPE_CREATE',
      '/collateral': 'COLLATERAL_READ',
      '/collateral/add': 'COLLATERAL_CREATE',
      '/loan/list': 'LOAN_READ',
      '/loan/create': 'LOAN_CREATE',
      '/dealer-list': 'DEALER_READ',
      '/dealer-registration': 'DEALER_CREATE',
      '/product-types': 'BRANCH_CREATE',
      '/create-product-type': 'BRANCH_CREATE',
      '/hp-product/list': 'BRANCH_CREATE',
      '/add-hp-product': 'BRANCH_CREATE',
      '/component/button': 'BRANCH_CREATE', //frontend only
      '/component/badges': 'BRANCH_CREATE', //frontend only
      '/component/breadcrumb-paging': 'BRANCH_CREATE', //frontend only
      '/component/collapse': 'BRANCH_CREATE', //frontend only
      '/component/tabs-pills': 'BRANCH_CREATE', //frontend only
      '/component/typography': 'BRANCH_CREATE', //frontend only
      '/auth/signup': null, //frontend only
      '/auth/signin': null, //frontend only
      '/chart': 'BRANCH_CREATE', //frontend only
      '/forms': 'BRANCH_CREATE', //frontend only
      '/tables': 'BRANCH_CREATE', //frontend only
      '/sample-page': 'BRANCH_CREATE', //frontend only
      'javascript:': null //frontend only
    };
    return permissionMap[url] || 'UNKNOWN';
  }
}
