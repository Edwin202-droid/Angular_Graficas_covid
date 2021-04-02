import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  URL= 'https://pomber.github.io/covid19/timeseries.json';

  constructor(private http:HttpClient) { }

  /* Para obtener los datos debes regresar un observable */
  public Obtener():Observable<any>{
    return this.http.get<any>(this.URL);
  }

  public ObtenerPais(country:string):Observable<any>{
    return this.Obtener().pipe(
      map(resp=> resp[country])
    );
  }

  public fechasYpais(pais:string, fechaDesde:Date, fechaHasta:Date):Observable<any>{
    return this.ObtenerPais(pais).pipe(
      /* Nuestra fecha va recorriendo desde y hasta los filtros que hemos declarado */
      map(resp=> resp.filter(val=>new Date(val.date)>=fechaDesde && new Date(val.date)<=fechaHasta))
    );
  }
}
