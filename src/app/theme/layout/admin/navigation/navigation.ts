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
    icon: 'bi bi-compass', // Bootstrap compass icon
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/analytics',
        icon: 'bi bi-speedometer2' // Bootstrap dashboard icon
      }
    ]
  },
  {
    id: 'User Mangement',
    title: 'User Mangement',
    type: 'group',
    icon: 'bi bi-compass', // Bootstrap compass icon
    children: [
      {
        id: 'User Management',
        title: 'User Create',
        type: 'item',
        url: '/create-user',
        icon: 'bi bi-speedometer2' // Bootstrap dashboard icon
      }
    ]
  },
  {
    id: 'Role Mangement',
    title: 'Role Mangement',
    type: 'group',
    icon: 'bi bi-compass', // Bootstrap compass icon
    children: [
      {
        id: 'User Management',
        title: 'Role Create',
        type: 'item',
        url: '/create-role',
        icon: 'bi bi-speedometer2' // Bootstrap dashboard icon
      }
    ]
  },
  {
    id: 'branch',
    title: 'Branch',
    type: 'group',
    icon: 'flowbite:building-outline', // Flowbite building icon
    children: [
      {
        id: 'Branch',
        title: 'Branch',
        type: 'collapse',
        icon: 'bi bi-diagram-3', // Bootstrap branches icon
        children: [
          {
            id: 'Branch Create',
            title: 'Branch Create',
            type: 'item',
            url: '/branch/create',
            icon: 'bi bi-plus-circle'
          },
          {
            id: 'Branch list',
            title: 'Branch List',
            type: 'item',
            url: '/branch/list',
            icon: 'bi bi-list-ul'
          },
        ]
      }
    ]
  },
  {
    id: 'CIF',
    title: 'CIF',
    type: 'group',
    icon: 'bi bi-person-lines-fill',
    children: [
      {
        id: 'Create CIF',
        title: 'CIF',
        type: 'collapse',
        icon: 'bi bi-person-plus',
        children: [
          {
            id: 'CIf Account List',
            title: 'CIF-Account List',
            type: 'item',
            url: '/cif/list',
            icon: 'bi bi-list-check'
          },
          {
            id: 'Create CIF Account',
            title: 'Create CIF Account',
            type: 'item',
            url: '/cif/create',
            icon: 'bi bi-person-add'
          },
        ]
      }
    ]
  },
  {
    id: 'Current-Account',
    title: 'Current-Account',
    type: 'group',
    icon: 'flowbite:bank-outline',
    children: [
      {
        id: 'Current-Account List',
        title: 'Current-Account',
        type: 'collapse',
        icon: 'bi bi-wallet2',
        children: [
          {
            id: 'badges',
            title: 'Current-Account List',
            type: 'item',
            url: '/current-account/list',
            icon: 'bi bi-card-list'
          }
        ]
      }
    ]
  },
  {
    id: 'transaction',
    title: 'transaction',
    type: 'group',
    icon: 'bi bi-arrow-left-right',
    children: [
      {
        id: 'transaction',
        title: 'transaction',
        type: 'item',
        url: '/transaction',
        icon: 'flowbite:cash-outline'
      }
    ]
  },
  {
    id: 'Collateral Type',
    title: 'Collateral Type',
    type: 'group',
    icon: 'bi bi-shield-check',
    children: [
      {
        id: 'Collateral Type',
        title: 'Collateral Type',
        type: 'collapse',
        icon: 'bi bi-safe',
        children: [
          {
            id: 'Collateral Type List',
            title: 'Collateral-Type List',
            type: 'item',
            url: '/collateralType/list',
            icon: 'bi bi-list-ol'
          },
          {
            id: 'Create Collateral-Type',
            title: 'Create Collateral-Type',
            type: 'item',
            url: '/collateralType/create',
            icon: 'bi bi-plus-square'
          },
        ]
      }
    ]
  },
  {
    id: 'collateral',
    title: 'Collateral',
    type: 'group',
    icon: 'flowbite:shield-outline',
    children: [
      {
        id: 'collateral',
        title: 'Collateral',
        type: 'collapse',
        icon: 'bi bi-lock',
        children: [
          {
            id: 'Collaterallist',
            title: 'Collaterallist',
            type: 'item',
            url: '/collateral',
            icon: 'bi bi-list-stars'
          },
          {
            id: 'Collateral Add',
            title: 'Collateral Add',
            type: 'item',
            url: '/collateral/add',
            icon: 'bi bi-plus-lg'
          },
        ]
      }
    ]
  },
  {
    id: 'Loan',
    title: 'Loan',
    type: 'group',
    icon: 'bi bi-cash-coin',
    children: [
      {
        id: 'Loan',
        title: 'Loan',
        type: 'collapse',
        icon: 'bi bi-bank',
        children: [
          {
            id: 'All Loan List',
            title: 'All Loan List',
            type: 'item',
            url: '/loan/list',
            icon: 'bi bi-list-task'
          },
          {
            id: 'Loan Registration',
            title: 'Loan Registration',
            type: 'item',
            url: '/loan/create',
            icon: 'bi bi-file-earmark-plus'
          },
        ]
      }
    ]
  },
  {
    id: 'Dealer',
    title: 'Dealer',
    type: 'group',
    icon: 'flowbite:users-outline',
    children: [
      {
        id: 'Dealer',
        title: 'Dealer',
        type: 'collapse',
        icon: 'bi bi-person-workspace',
        children: [
          {
            id: 'Dealer List',
            title: 'Dealer List',
            type: 'item',
            url: '/dealer-list',
            icon: 'bi bi-people'
          },
          {
            id: 'Dealer Registration',
            title: 'Dealer Registration',
            type: 'item',
            url: '/dealer-registration',
            icon: 'bi bi-person-plus-fill'
          },
        ]
      }
    ]
  },
  {
    id: 'Product-Type',
    title: 'Product Type',
    type: 'group',
    icon: 'bi bi-box-seam',
    children: [
      {
        id: 'Product Type',
        title: 'Product Type',
        type: 'collapse',
        icon: 'bi bi-boxes',
        children: [
          {
            id: 'Product-Type List',
            title: 'Product-Type List',
            type: 'item',
            url: '/product-types',
            icon: 'bi bi-grid'
          },
          {
            id: 'Add Product-Type',
            title: 'Add Product-Type',
            type: 'item',
            url: '/create-product-type',
            icon: 'bi bi-plus-circle-fill'
          },
        ]
      }
    ]
  },
  {
    id: 'Hp Product',
    title: 'Hp Product',
    type: 'group',
    icon: 'flowbite:shopping-bag-outline',
    children: [
      {
        id: 'Hp Product',
        title: 'Hp Product',
        type: 'collapse',
        icon: 'bi bi-cart3',
        children: [
          {
            id: 'Hp-Product List',
            title: 'Hp-Product List',
            type: 'item',
            url: '/hp-product/list',
            icon: 'bi bi-cart-check'
          },
          {
            id: 'Add Hp-Product',
            title: 'Add Hp-Product',
            type: 'item',
            url: '/add-hp-product',
            icon: 'bi bi-cart-plus'
          },
        ]
      }
    ]
  },
  {
    id: 'ui-component',
    title: 'Ui Component',
    type: 'group',
    icon: 'bi bi-puzzle',
    children: [
      {
        id: 'basic',
        title: 'Component',
        type: 'collapse',
        icon: 'bi bi-bricks',
        children: [
          {
            id: 'button',
            title: 'Button',
            type: 'item',
            url: '/component/button',
            icon: 'bi bi-square'
          },
          {
            id: 'badges',
            title: 'Badges',
            type: 'item',
            url: '/component/badges',
            icon: 'bi bi-award'
          },
          {
            id: 'breadcrumb-pagination',
            title: 'Breadcrumb & Pagination',
            type: 'item',
            url: '/component/breadcrumb-paging',
            icon: 'bi bi-signpost'
          },
          {
            id: 'collapse',
            title: 'Collapse',
            type: 'item',
            url: '/component/collapse',
            icon: 'bi bi-arrows-collapse'
          },
          {
            id: 'tabs-pills',
            title: 'Tabs & Pills',
            type: 'item',
            url: '/component/tabs-pills',
            icon: 'bi bi-tab'
          },
          {
            id: 'typography',
            title: 'Typography',
            type: 'item',
            url: '/component/typography',
            icon: 'bi bi-fonts'
          }
        ]
      }
    ]
  },
  {
    id: 'Authentication',
    title: 'Authentication',
    type: 'group',
    icon: 'bi bi-lock-fill',
    children: [
      {
        id: 'signup',
        title: 'Sign up',
        type: 'item',
        url: '/auth/signup',
        icon: 'bi bi-person-plus',
        target: true,
        breadcrumbs: false
      },
      {
        id: 'signin',
        title: 'Sign in',
        type: 'item',
        url: '/auth/signin',
        icon: 'bi bi-box-arrow-in-right',
        target: true,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'chart',
    title: 'Chart',
    type: 'group',
    icon: 'flowbite:chart-pie-outline',
    children: [
      {
        id: 'apexchart',
        title: 'ApexChart',
        type: 'item',
        url: '/chart',
        classes: 'nav-item',
        icon: 'bi bi-bar-chart'
      }
    ]
  },
  {
    id: 'forms & tables',
    title: 'Forms & Tables',
    type: 'group',
    icon: 'bi bi-layout-text-window',
    children: [
      {
        id: 'forms',
        title: 'Basic Forms',
        type: 'item',
        url: '/forms',
        classes: 'nav-item',
        icon: 'bi bi-input-cursor-text'
      },
      {
        id: 'tables',
        title: 'tables',
        type: 'item',
        url: '/tables',
        classes: 'nav-item',
        icon: 'bi bi-table'
      }
    ]
  },
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'bi bi-three-dots',
    children: [
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'bi bi-file-earmark'
      },
      {
        id: 'menu-level',
        title: 'Menu Levels',
        type: 'collapse',
        icon: 'bi bi-layers',
        children: [
          {
            id: 'menu-level-2.1',
            title: 'Menu Level 2.1',
            type: 'item',
            url: 'javascript:',
            icon: 'bi bi-layer-forward',
            external: true
          },
          {
            id: 'menu-level-2.2',
            title: 'Menu Level 2.2',
            type: 'collapse',
            icon: 'bi bi-stack',
            children: [
              {
                id: 'menu-level-2.2.1',
                title: 'Menu Level 2.2.1',
                type: 'item',
                url: 'javascript:',
                icon: 'bi bi-layer-backward',
                external: true
              },
              {
                id: 'menu-level-2.2.2',
                title: 'Menu Level 2.2.2',
                type: 'item',
                url: 'javascript:',
                icon: 'bi bi-layers-half',
                external: true
              }
            ]
          }
        ]
      }
    ]
  }
];