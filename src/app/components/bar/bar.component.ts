import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { forkJoin, Observable } from 'rxjs';
import { CovidService } from 'src/app/services/covid.service';

const MES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SET', 'OCT', 'NOV', 'DIC'];

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {


  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Activos' },
    { data: [], label: 'Recuperados' }
  ];
  public barChartColors: Color[]= [
    {
      backgroundColor: 'rgba(255,0,0,0.9)'
    },{
      backgroundColor: 'rgba(0,210,0,0.9)'
    }
  ];

  paises:string[]=[];
  pais:string[]=[];
  ultimoDia:number[]=[];

  constructor(private covidService:CovidService) { }

  ngOnInit() {
    this.getPaises();
    this.ultimosDias();
  }
  getPaises(){
    this.covidService.Obtener().subscribe(resp=>{
      /* Obtenemos los paises */
      this.paises= Object.keys(resp);
      //console.log(this.paises); 
    });
  }

  ultimosDias(){
    const mes = new Date().getMonth();
    /* Obteniendo el ultimo dia del mes pasado
      por ejemplo: si mes es abril -> 0 de mayo = 30 de abril */
    let fecha = new Date(new Date().getFullYear(), mes + 1 , 0);
    for( let i= 1; i<=mes; i++){  
      /* Obteniendo todos los ultimos dias de los meses */
      fecha = new Date(new Date().getFullYear(),i,0);
      this.ultimoDia.push(fecha.getDate());
    }

  }
  cargarData(event:any){
    if(this.pais){
      this.clear();
      const obs: Observable<any>[] = new Array();
      for (let i = 0; i < this.ultimosDias.length; i++){
        const date = new Date();
        date.setDate(this.ultimosDias[i]);
        date.setMonth(i);
        date.setHours(0,0,0,0);

        let obsAct: Observable<any> = new Observable();
        obsAct = this.covidService.fechasYpais(this.pais as any,date, date);
        obs.push(obsAct);
      }
      forkJoin(obs).subscribe(
        data => {
          data.forEach((resp,i)=>{
            this.barChartData[0].data[i] = resp[0].confirmed - resp[0].recovered - resp[0].deaths;
            this.barChartData[1].data[i]= resp[0].recovered;
            this.barChartLabels.push(MES[i]);
          });
        }
      );
    }
  }


  clear(){
    this.barChartData[0].data=[];
    this.barChartData[1].data=[];
    this.barChartLabels=[];
  }

}
