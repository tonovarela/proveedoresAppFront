import { PagesModule } from './pages/pages.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { APP_ROUTES } from './app.Routes';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyPipe, DatePipe, CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';



@NgModule({
  declarations: [
    AppComponent,    
    LoginComponent,
    NopagefoundComponent,    
  ],
  imports: [        
    //BrowserModule,
    HttpClientModule,
    FormsModule,        
    ReactiveFormsModule,
    PagesModule,
    FormsModule,
    CheckBoxModule,    
    APP_ROUTES,
    NgbModule,
    CommonModule
  ],
  
  providers: [CurrencyPipe,DatePipe,ToolbarService, LinkService, ImageService, HtmlEditorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
