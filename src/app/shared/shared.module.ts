import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns';



@NgModule({
  declarations: [
    HeaderComponent,  
    BreadcrumbsComponent,
    SidebarComponent,
  ],
  exports: [
    HeaderComponent,
    BreadcrumbsComponent,
    SidebarComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    AutoCompleteModule, 
  ]
})
export class SharedModule { }
