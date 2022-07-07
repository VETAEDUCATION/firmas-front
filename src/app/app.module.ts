import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DrawareaComponent } from './components/drawarea/drawarea.component';
import { ContractComponent } from './pages/contract/contract.component';

@NgModule({
  declarations: [
    AppComponent,
    DrawareaComponent,
    ContractComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    PdfViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
