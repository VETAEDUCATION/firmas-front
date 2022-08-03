import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './pages/company/company.component';
import { ContractComponent } from './pages/contract/contract.component';

const routes: Routes = [{ path: 'contract/:id', component: ContractComponent },
{ path: 'company/:id', component: CompanyComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
