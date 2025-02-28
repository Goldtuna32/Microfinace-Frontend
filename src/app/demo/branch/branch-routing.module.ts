import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchListComponent } from './components/branch-list/branch-list.component';
import { BranchCreateComponent } from './components/branch-create/branch-create.component';

const routes: Routes = [
  { path: 'list', component: BranchListComponent },
  { path: 'create', component: BranchCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule { }
