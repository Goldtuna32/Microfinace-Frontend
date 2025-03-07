import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealerRegistrationComponent } from './components/dealer-registration/dealer-registration.component';
import { DealerRegistrationRoutingModule } from './dealer-registration-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DealerRegistrationComponent,
    DealerRegistrationRoutingModule,
    ReactiveFormsModule,
    FormsModule
    
  ]
})
export class DealerRegistrationModule {
  static DealerRegistrationModule: any;
}
