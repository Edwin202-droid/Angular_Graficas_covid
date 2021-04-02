import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { CovidService } from 'src/app/services/covid.service';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['Confirmados','Recuperados','Activos','Muertos'];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors: any =[
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
  pais:string=null;

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
    this.pieChartData=[];
  }
  
  cargarData(event:any){
    if(this.pais){
      this.clear();
      this.covidService.ObtenerPais(this.pais).subscribe(
        data =>{
          const ultimo = data.pop();
          this.pieChartData[0] = ultimo.confirmed;
          this.pieChartData[1] = ultimo.recovered;
          this.pieChartData[2] = ultimo.confirmed - ultimo.recovered - ultimo.deaths;
          this.pieChartData[3] = ultimo.deaths;
        }
      );
    }
  }

}
