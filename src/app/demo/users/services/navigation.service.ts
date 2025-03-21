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
                  if (!permissions.includes(requiredPermission)) {
                      return null; // Remove item if user lacks permission
                  }
              }
              return filteredItem;
          })
          .filter(item => item !== null) as NavigationItem[];
  }

  private getRequiredPermission(url: string): string {
      const permissionMap: { [key: string]: string } = {
          '/analytics': 'DASHBOARD_READ',
          '/branch/create': 'BRANCH_CREATE',
          '/branch/list': 'BRANCH_READ',
          '/cif/list': 'CIF_READ',
          '/cif/create': 'CIF_CREATE',
          '/current-account/list': 'CURRENT_ACCOUNT_READ',
          '/transaction': 'TRANSACTION_READ',
          '/collateralType/list': 'COLLATERAL_TYPE_READ',
          '/collateralType/create': 'COLLATERAL_TYPE_CREATE',
          '/collateral': 'COLLATERAL_READ',
          '/collateral/add': 'COLLATERAL_CREATE',
          '/loan/list': 'LOAN_READ',
          '/loan/create': 'LOAN_CREATE',
          '/dealer-list': 'DEALER_READ',
          '/dealer-registration': 'DEALER_CREATE',
          '/product-types': 'PRODUCT_TYPE_READ',
          '/create-product-type': 'PRODUCT_TYPE_CREATE',
          '/hp-product/list': 'HP_PRODUCT_READ',
          '/add-hp-product': 'HP_PRODUCT_CREATE',
          '/component/button': 'UI_COMPONENT_READ',
          '/component/badges': 'UI_COMPONENT_READ',
          '/component/breadcrumb-paging': 'UI_COMPONENT_READ',
          '/component/collapse': 'UI_COMPONENT_READ',
          '/component/tabs-pills': 'UI_COMPONENT_READ',
          '/component/typography': 'UI_COMPONENT_READ',
          '/auth/signup': 'AUTH_SIGNUP',
          '/auth/signin': 'AUTH_SIGNIN',
          '/chart': 'CHART_READ',
          '/forms': 'FORMS_READ',
          '/tables': 'TABLES_READ',
          '/sample-page': 'SAMPLE_PAGE_READ',
          // Handle 'javascript:' URLs if needed, or exclude them
          'javascript:': 'MENU_LEVEL_READ'
      };
      return permissionMap[url] || 'UNKNOWN';
  }
}
