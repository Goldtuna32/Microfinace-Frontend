import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CifRoutingModule } from './cif-routing.module';
import { CifListComponent } from './components/cif-list/cif-list.component';
 

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CifRoutingModule,
    CifListComponent,
    Component,
  
  ]
})
export class CifModule { }
