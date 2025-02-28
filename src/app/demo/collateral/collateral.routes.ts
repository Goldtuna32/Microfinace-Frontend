import { Routes } from '@angular/router';
import { CollateralListComponent } from './components/collateral-list/collateral-list.component';
import { CollateralFormComponent } from './components/collateral-form/collateral-form.component';
import { CollateralDetailComponent } from './components/collateral-detail/collateral-detail.component';

export const COLLATERAL_ROUTES: Routes = [
    { path: '', component: CollateralListComponent },
    { path: 'add', component: CollateralFormComponent },
    { path: ':id', component: CollateralDetailComponent }
];
