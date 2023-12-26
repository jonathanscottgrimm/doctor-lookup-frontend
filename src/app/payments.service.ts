import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentIntent } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})

export class PaymentsService {
  baseUrl = 'https://localhost:7250/payments';
  constructor(private http: HttpClient) { }

  createPaymentIntent(amount: number): Observable<any> {
    const params = { amount };
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8')

    return this.http.get(this.baseUrl, {params, headers,responseType:'text' as const});
  }
}
