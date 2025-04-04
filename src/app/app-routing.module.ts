// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

import { COLLATERAL_ROUTES } from './demo/collateral/collateral.routes';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/analytics',
        pathMatch: 'full'
      },
      {
        path: 'analytics',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component')
      },
      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/chart-maps/core-apex.component')
      },
      {
        path: 'forms',
        loadComponent: () => import('./demo/forms/form-elements/form-elements.component')
      },
      {
        path: 'tables',
        loadComponent: () => import('./demo/tables/tbl-bootstrap/tbl-bootstrap.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component')
      },
      {
        path: 'branch/create',
        loadComponent: () => import('./demo/branch/components/branch-create/branch-create.component')
          .then(m => m.BranchCreateComponent)
      },
      {
        path: 'branch/list',
        loadComponent: () => import('./demo/branch/components/branch-list/branch-list.component')
          .then(m => m.BranchListComponent)
      },
      { path: 'branches/:id',
        loadComponent: () => import('./demo/branch/components/branch-detail/branch-detail.component')
        .then(m => m.BranchDetailComponent)
       },
      {
        path: 'cif/create',
        loadComponent: () => import('./demo/cif/components/cif-create/cif-create.component')
          .then(m => m.CifCreateComponent)
      },
      {
        path: 'cif/list',
        loadComponent: () => import('./demo/cif/components/cif-list/cif-list.component')
          .then(m => m.CifListComponent)
      },
      {
        path: 'collateralType/create',
        loadComponent: () => import('./demo/collateral-type/components/create-collateral-type/create-collateral-type.component')
         .then(m => m.CreateCollateralTypeComponent)
      },
      {
        path: 'collateralType/list',
        loadComponent: () => import('./demo/collateral-type/components/collateral-type-list/collateral-type-list.component')
        .then(m => m.CollateralTypeListComponent)
      },
      {
        path: 'cif/edit/:id',
        loadComponent: () => import('./demo/cif/components/cif-edit/cif-edit.component')
          .then(m => m.CifEditComponent)
      },
      {
        path: 'loan/create',
        loadComponent: () => import('./demo/loan/components/loan-create/loan-create.component')
          .then(m => m.LoanCreateComponent)
      },
      {
        path: 'loan/list',
        loadComponent: () => import('./demo/loan/components/loan-list/loan-list.component')
         .then(m => m.LoanListComponent)
      },
      {
        path: 'loans/:loanId/repayment-schedule',
        loadComponent: () => import('./demo/repayment-schedule/components/repayment-schedule/repayment-schedule.component')
          .then(m => m.RepaymentScheduleComponent)
      },
      {
        path: 'loans/:id',
        loadComponent: () => import('./demo/loan/components/loan-detail/loan-detail.component')
         .then(m => m.LoanDetailComponent)
      },
      {
        path: 'loans/:id/edit',
        loadComponent: () => import('./demo/loan/components/loan-edit/loan-edit.component')
          .then(m => m.LoanEditComponent)
      },
      {
        path: 'current-account/list',
        loadComponent: () => import('./demo/current-account/components/current-account-list/current-account-list.component')
          .then(m => m.CurrentAccountListComponent)
      },
      { path: 'collateral', children: COLLATERAL_ROUTES },
      
      {
        path: 'transaction',
        loadComponent: () => import('./demo/transaction/components/transaction/transaction.component')
         .then(m => m.TransactionComponent)
      },
      {
        path: 'transaction-history/:accountId',
        loadComponent: () => import('./demo/transaction/components/history/history.component')
          .then(m => m.HistoryComponent)
      },
      {
        path: 'dealer-registration',
        loadComponent: () => import('./demo/dealer-registration/components/dealer-registration/dealer-registration.component')
          .then(m => m.DealerRegistrationComponent)
      },
      {
        path: 'dealer-list',
        loadComponent: () => import('./demo/dealer-registration/components/dealer-registration-list/dealer-registration-list.component')
          .then(m => m.DealerRegistrationListComponent)
      },

      {
        path: 'dealer/edit/:id',
        loadComponent: () => import('./demo/dealer-registration/components/dealar-edit/dealar-edit.component')
          .then(m => m.DealerEditComponent)
      },
      

      {
        path: 'create-product-type',
        loadComponent: () => import('./demo/product-type/components/create-product-type/create-product-type.component') 
          .then(m => m.CreateProductTypeComponent)
      },
      {
        path: 'product-types',
        loadComponent: () => import('./demo/product-type/components/product-type-list/product-type-list.component') 
          .then(m => m.ProductTypeListComponent)
      },
      {
        path: 'product-types/edit/:id',
        loadComponent: () => import('./demo/product-type/components/product-type-edit/product-type-edit.component')
         .then(m => m.ProductTypeEditComponent)
      },
      {
        path: 'hp-product/list',
        loadComponent: () => import('./demo/hp-product/components/hp-product-list/hp-product-list.component')
         .then(m => m.HpProductListComponent)
      },
      {
        path: 'add-hp-product',
        loadComponent: () => import('./demo/hp-product/components/add-hp-product/add-hp-product.component')
          .then(m => m.AddHpProductComponent)
      },
      {
        path: 'edit-hp-product/:id',
        loadComponent: () => import('./demo/hp-product/components/hp-product-edit/hp-product-edit.component')
          .then(m => m.HpProductEditComponent)
      }
     

    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth/signup',
        loadComponent: () => import('./demo/pages/authentication/sign-up/sign-up.component')
      },
      {
        path: 'auth/signin',
        loadComponent: () => import('./demo/pages/authentication/sign-in/sign-in.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
