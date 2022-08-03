import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HttpClientModule } from '@angular/common/http';
import { CookieModule } from 'ngx-cookie';
import { AppRoutingModule } from './app-routing.module';
import { QRCodeModule } from 'angularx-qrcode';

import { AppComponent } from './app.component';
import { DrawareaComponent } from './components/drawarea/drawarea.component';
import { ContractComponent } from './pages/contract/contract.component';
import { CompanyComponent } from './pages/company/company.component';

@NgModule({
  declarations: [
    AppComponent,
    DrawareaComponent,
    ContractComponent,
    CompanyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    PdfViewerModule,
    QRCodeModule,
    CookieModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
