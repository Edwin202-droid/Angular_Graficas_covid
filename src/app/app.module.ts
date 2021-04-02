import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PrincipalComponent } from './principal/principal.component';
import { BottomComponent } from './bottom/bottom.component';
import { FooterComponent } from './footer/footer.component';
import { PieComponent } from './components/pie/pie.component';
import { DonutComponent } from './components/donut/donut.component';
import { BarComponent } from './components/bar/bar.component';

/* DatePicker */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
/* Idioma del DatePicker */
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale);

/* Ng2-Charts: Graficas */
import { ChartsModule, ThemeService } from 'ng2-charts';

/* Importaciones */
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    PrincipalComponent,
    BottomComponent,
    FooterComponent,
    PieComponent,
    DonutComponent,
    BarComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    /* DatePicker */
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    ChartsModule
  ],
  
  providers: [ 
    /* DatePicker, solucion error */
    BsDatepickerConfig,
    /* Ng2Charts, solucion error */
    ThemeService,
    /* Transformar la fecha del url */
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
