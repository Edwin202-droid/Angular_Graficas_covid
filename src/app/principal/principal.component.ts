import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CovidService } from '../services/covid.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  //=======================
  //Grafica de lineas
  //================0
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Confirmados' },
    { data: [], label: 'Recuperados' },
    { data: [], label: 'Activos' },
    { data: [], label: 'Muertes' },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions= {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'yellow',
      backgroundColor: 'rgba(200,200,0,0.3)',
    },
    {
      borderColor: 'gree',
      backgroundColor: 'rgba(0,210,0,0.3)',
    },
    {
      borderColor: 'red',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
    {
      borderColor: 'black',
      backgroundColor: 'rgba(136,136,136,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  //========================
  //=========================0

  idioma = 'es';
  paises:string[]=[];
  pais:string[]=[];

  fechaInicio: Date;
  fechaFin: Date;
  minimoDato: Date;
  maximoDato: Date;

  constructor(private localeService: BsLocaleService,
              private covidService:CovidService,
              private datePipe:DatePipe) {

    /* Ponemos el idioma al DatepICKER */
    this.localeService.use(this.idioma);
    /* Minimo de fecha admitida */
    this.minimoDato= new Date('2020-1-22');
    /* Maximo de fecha admitida */
    this.maximoDato= new Date();
    this.maximoDato.setDate(this.maximoDato.getDate()-1);
   }

  ngOnInit() {
      this.getPaises();
      /* Obteniendo info del covid en un pais 
      this.covidService.ObtenerPais('Peru').subscribe(resp=>{
        console.log(resp);
      });*/
  }

  getPaises(){
    this.covidService.Obtener().subscribe(resp=>{
      /* Obtenemos los paises */
      this.paises= Object.keys(resp);
      //console.log(this.paises); 
    });
  }

  cargarData(event:any){
    if(this.pais && this.fechaInicio && this.fechaFin){
      forkJoin([
        /* Estamos importando el servicio y pasando por el map para traer los casos confirmador,etc */
        this.covidService.fechasYpais(this.pais as any, this.fechaInicio, this.fechaFin).pipe(map(data => data.map(val=>val.confirmed))),
        this.covidService.fechasYpais(this.pais as any, this.fechaInicio, this.fechaFin).pipe(map(data => data.map(val=>val.recovered))),
        this.covidService.fechasYpais
          (this.pais as any, this.fechaInicio, this.fechaFin).pipe(map(data => data.map(val=>val.confirmed - val.recovered - val.deaths))),
        this.covidService.fechasYpais(this.pais as any, this.fechaInicio, this.fechaFin).pipe(map(data => data.map(val=>val.deaths))),
        /* Aqui traemos la fecha de cada dia y lo transformamos en dias/mes */
        this.covidService.fechasYpais(this.pais as any, this.fechaInicio, this.fechaFin).pipe(map(data => data.map(val=>this.datePipe.transform(val.date, 'dd/MM' )))),
      ]).subscribe(
        /* forkJoin devuelve un arreglo -> data0 -> val.confirmes, data1 -> val.recovered, etc. Y todo esto lo mandamos a la grafica de arriba */
        ([data0, data1, data2, data3, data4])=>{
          this.lineChartData[0].data = data0;
          this.lineChartData[1].data = data1;
          this.lineChartData[2].data = data2;
          this.lineChartData[3].data = data3;

          this.lineChartLabels = data4;
        });
    }
  }


}
