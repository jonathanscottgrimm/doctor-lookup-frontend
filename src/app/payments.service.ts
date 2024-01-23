import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PaymentsService {
  baseUrl = 'https://doclicenselookupapi20240119105712.azurewebsites.net/payments';
  constructor(private http: HttpClient) { }

  createPaymentIntent(amount: number): Observable<any> {
    const params = { amount };
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8')

    return this.http.get(this.baseUrl, {params, headers,responseType:'text' as const});
  }
}
