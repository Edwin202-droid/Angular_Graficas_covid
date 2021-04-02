import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, MultiDataSet} from 'ng2-charts';
import { forkJoin } from 'rxjs';
import { CovidService } from 'src/app/services/covid.service';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.css']
})
export class DonutComponent implements OnInit {

  public doughnutChartOptions: ChartOptions = {
    responsive: true,
  };
  public doughnutChartLabels: Label[] = ['Confirmados','Recuperados','Activos','Muertos'];
  public doughnutChartData: MultiDataSet = [
    [],
    []
  ];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartLegend = true;
  public doughnutChartPlugins = [];
  public doughnutChartColors: any =[
    {
      backgroundColor:[
        'rgba(200,200,0,0.9)',
        'rgba(0,210,0,0.9)',
        'rgba(255,000,0,0.9)',
        'rgba(136,136,136,0.9)'
      ]
    },
    {
      backgroundColor:[
        'rgba(200,200,0,0.9)',
        'rgba(0,210,0,0.9)',
        'rgba(255,000,0,0.9)',
        'rgba(136,136,136,0.9)'
      ]
    }
  ];
  paises: string[]=[];
  pais1:string=null;
  pais2:string=null;

  constructor(private covidService:CovidService) { }

  ngOnInit() {
    this.getPaises();
  }

 /* Obtenemos todos los paises */
 getPaises(){
  this.covidService.Obtener().subscribe(resp=>{
    /* Obtenemos los paises */
    this.paises= Object.keys(resp);
    //console.log(this.paises); 
  });
}

  clear(){
    this.doughnutChartData=[];
    this.doughnutChartData.push([]);
    this.doughnutChartData.push([]);
  }

  cargarData(event:any){
    if(this.pais1 && this.pais2){
      this.clear();
      forkJoin([
        this.covidService.ObtenerPais(this.pais1),
        this.covidService.ObtenerPais(this.pais2)
      ]).subscribe(
        ([data1, data2])=>{
          const ultimo1 = data1.pop();
          const ultimo2 = data2.pop();
          //Data 1
          this.doughnutChartData[0][0] = ultimo1.confirmed;
          this.doughnutChartData[0][1] = ultimo1.recovered;
          this.doughnutChartData[0][2] = ultimo1.confirmed - ultimo1.recovered - ultimo1.deaths;
          this.doughnutChartData[0][3] = ultimo1.deaths;
          //Data 2
          this.doughnutChartData[1][0] = ultimo2.confirmed;
          this.doughnutChartData[1][1] = ultimo2.recovered;
          this.doughnutChartData[1][2] = ultimo2.confirmed - ultimo2.recovered - ultimo2.deaths;
          this.doughnutChartData[1][3] = ultimo2.deaths;
        }
      );
    }
  }

}
