import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LicenseInfo } from './LicenseInfo';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  public baseUrl = 'https://localhost:7250/licensefinder';

  constructor(private httpClient: HttpClient) {}

  public GetLicenseInfo(
    lastName: string,
    firstName: string = '',
    isDoSearch: boolean = false): Observable<LicenseInfo[]> {
    const params = { firstName, lastName, isDoSearch };

    return this.httpClient.get<LicenseInfo[]>(this.baseUrl, { params });
  }
}
