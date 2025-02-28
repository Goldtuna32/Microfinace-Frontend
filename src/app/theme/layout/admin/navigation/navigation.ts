export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/analytics',
        icon: 'feather icon-home'
      }
    ]
  },
  {
    id: 'branch',
    title: 'Branch',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'Branch',
        title: 'Branch',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'Branch Create',
            title: 'Branch Create',
            type: 'item',
            url: '/branch/create',
            icon: 'feather icon-plus'
          },
          {
            id: 'Branch list',
            title: 'Branch List',
            type: 'item',
            url: '/branch/list',
            icon: 'feather icon-list'
          },
        ]
      }
    ]
  },
  {
    id: 'CIF',
    title: 'CIF',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'Create CIF',
        title: 'CIF',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'CIf Account List',
            title: 'CIF-Account List',
            type: 'item',
            url: '/cif/list',
            icon: 'feather icon-list'
          },
          {
            id: 'Create CIF Account',
            title: 'Create CIF Account',
            type: 'item',
            url: '/cif/create',
            icon: 'feather icon-plus'
          },
        ]
      }
    ]
  },
  {
    id: 'Current-Account',
    title: 'Current-Account',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'Current-Account List',
        title: 'Current-Account',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'badges',
            title: 'Current-Account List',
            type: 'item',
            url: '/current-account/list'
          }
        ]
      }
    ]
  },

  {
    id: 'transaction',
    title: 'transaction',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'transaction',
        title: 'transaction',
        type: 'item',
        url: '/transaction',
        icon: 'feather icon-box'
      }
    ]
  },

  {
    id: 'collateral',
    title: 'Collateral',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'collateral-list',
        title: 'Collateral-list',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'Collaterallist',
            title: 'Collaterallist',
            type: 'item',
            url: '/collateral',
            icon: 'feather icon-list'
          },
          {
            id: 'Collateral Add',
            title: 'Collateral Add',
            type: 'item',
            url: '/collateral/add',
            icon: 'feather icon-plus'
          },
        ]
      }
    ]
  }
  ,
  {
    id: 'Loan',
    title: 'Loan',
    type: 'group',
    icon: 'feather icon-home', // 🏢 Represents a branch
    children: [
      {
        id: 'create loan',
        title: 'Create Loan',
        type: 'item',
        url: '/loan/create',
        icon: 'feather icon-plus' // ➕ Indicates adding a new branch
      },
      {
        id: 'view loan',
        title: 'All Loan',
        type: 'item',
        url: '/loan/list',
        icon: 'feather icon-list' // 📋 Represents a list of branches
      }
    ]
  },
  {
    id: 'ui-component',
    title: 'Ui Component',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'basic',
        title: 'Component',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'button',
            title: 'Button',
            type: 'item',
            url: '/component/button'
          },
          {
            id: 'badges',
            title: 'Badges',
            type: 'item',
            url: '/component/badges'
          },
          {
            id: 'breadcrumb-pagination',
            title: 'Breadcrumb & Pagination',
            type: 'item',
            url: '/component/breadcrumb-paging'
          },
          {
            id: 'collapse',
            title: 'Collapse',
            type: 'item',
            url: '/component/collapse'
          },
          {
            id: 'tabs-pills',
            title: 'Tabs & Pills',
            type: 'item',
            url: '/component/tabs-pills'
          },
          {
            id: 'typography',
            title: 'Typography',
            type: 'item',
            url: '/component/typography'
          }
        ]
      }
    ]
  },
  {
    id: 'Authentication',
    title: 'Authentication',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'signup',
        title: 'Sign up',
        type: 'item',
        url: '/auth/signup',
        icon: 'feather icon-at-sign',
        target: true,
        breadcrumbs: false
      },
      {
        id: 'signin',
        title: 'Sign in',
        type: 'item',
        url: '/auth/signin',
        icon: 'feather icon-log-in',
        target: true,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'chart',
    title: 'Chart',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'apexchart',
        title: 'ApexChart',
        type: 'item',
        url: '/chart',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart'
      }
    ]
  },
  {
    id: 'forms & tables',
    title: 'Forms & Tables',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'forms',
        title: 'Basic Forms',
        type: 'item',
        url: '/forms',
        classes: 'nav-item',
        icon: 'feather icon-file-text'
      },
      {
        id: 'tables',
        title: 'tables',
        type: 'item',
        url: '/tables',
        classes: 'nav-item',
        icon: 'feather icon-server'
      }
    ]
  },
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'feather icon-sidebar'
      },
      {
        id: 'menu-level',
        title: 'Menu Levels',
        type: 'collapse',
        icon: 'feather icon-menu',
        children: [
          {
            id: 'menu-level-2.1',
            title: 'Menu Level 2.1',
            type: 'item',
            url: 'javascript:',
            external: true
          },
          {
            id: 'menu-level-2.2',
            title: 'Menu Level 2.2',
            type: 'collapse',
            children: [
              {
                id: 'menu-level-2.2.1',
                title: 'Menu Level 2.2.1',
                type: 'item',
                url: 'javascript:',
                external: true
              },
              {
                id: 'menu-level-2.2.2',
                title: 'Menu Level 2.2.2',
                type: 'item',
                url: 'javascript:',
                external: true
              }
            ]
          }
        ]
      }
    ]
  }
];
