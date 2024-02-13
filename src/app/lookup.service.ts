import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { LicenseInfo } from './LicenseInfo';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  baseUrl =
    'https://doclicenselookupapi20240119105712.azurewebsites.net/LicenseFinder/';

  constructor(private httpClient: HttpClient) {}

  public GetLicenseInfo(
    lastName: string,
    firstName: string = '',
    isDoSearch: boolean = false
  ): Observable<LicenseInfo[]> {
    const params = { firstName, lastName, isDoSearch };

    return this.httpClient.get<LicenseInfo[]>(this.baseUrl + 'getgroupone', {
      params,
    });
  }

  public getAllGroups(
    lastName: string,
    firstName: string = '',
    isDoSearch: boolean = false
  ): Observable<LicenseInfo[]> {
    return forkJoin([
      this.getGroupOne(firstName, lastName, isDoSearch),
      this.getGroupTwo(firstName, lastName, isDoSearch),
      this.getGroupThree(firstName, lastName, isDoSearch),
      this.getGroupFour(firstName, lastName, isDoSearch),
      this.getGroupFive(firstName, lastName, isDoSearch),
      this.getGroupSix(firstName, lastName, isDoSearch),
      this.getGroupSeven(firstName, lastName, isDoSearch),
      this.getGroupEight(firstName, lastName, isDoSearch),
      this.getGroupNine(firstName, lastName, isDoSearch),
      this.getGroupTen(firstName, lastName, isDoSearch),
    ]).pipe(
      map((results): LicenseInfo[] => {
        // Flatten the array of arrays into a single array of LicenseInfo objects
        return results.reduce((acc, cur) => acc.concat(cur), []);
      })
    );
  }

  public getGroupOne(
    firstName: string,
    lastName: string,
    isDoSearch: boolean
  ): Observable<LicenseInfo[]> {
    const params = { firstName, lastName, isDoSearch };
    return this.httpClient.get<LicenseInfo[]>(`${this.baseUrl}/getgroupone`, {
      params,
    });
  }

  public getGroupTwo(
    firstName: string,
    lastName: string,
    isDoSearch: boolean
  ): Observable<LicenseInfo[]> {
    const params = { firstName, lastName, isDoSearch };
    return this.httpClient.get<LicenseInfo[]>(`${this.baseUrl}/getgrouptwo`, {
      params,
    });
  }

  public getGroupThree(
    firstName: string,
    lastName: string,
    isDoSearch: boolean
  ): Observable<LicenseInfo[]> {
    const params = { firstName, lastName, isDoSearch };
    return this.httpClient.get<LicenseInfo[]>(`${this.baseUrl}/getgroupthree`, {
      params,
    });
  }

  public getGroupFour(
    firstName: string,
    lastName: string,
    isDoSearch: boolean
  ): Observable<LicenseInfo[]> {
    const params = { firstName, lastName, isDoSearch };
    return this.httpClient.get<LicenseInfo[]>(`${this.baseUrl}/getgroupfour`, {
      params,
    });
  }

  public getGroupFive(
    firstName: string,
    lastName: string,
    isDoSearch: boolean
  ): Observable<LicenseInfo[]> {
    const params = { firstName, lastName, isDoSearch };
    return this.httpClient.get<LicenseInfo[]>(`${this.baseUrl}/getgroupfive`, {
      params,
    });
  }

  public getGroupSix(
    firstName: string,
    lastName: string,
    isDoSearch: boolean
  ): Observable<LicenseInfo[]> {
    const params = { firstName, lastName, isDoSearch };
    return this.httpClient.get<LicenseInfo[]>(`${this.baseUrl}/getgroupsix`, {
      params,
    });
  }

  public getGroupSeven(
    firstName: string,
    lastName: string,
    isDoSearch: boolean
  ): Observable<LicenseInfo[]> {
    const params = { firstName, lastName, isDoSearch };
    return this.httpClient.get<LicenseInfo[]>(`${this.baseUrl}/getgroupseven`, {
      params,
    });
  }

  public getGroupEight(
    firstName: string,
    lastName: string,
    isDoSearch: boolean
  ): Observable<LicenseInfo[]> {
    const params = { firstName, lastName, isDoSearch };
    return this.httpClient.get<LicenseInfo[]>(`${this.baseUrl}/getgroupeight`, {
      params,
    });
  }

  public getGroupNine(
    firstName: string,
    lastName: string,
    isDoSearch: boolean
  ): Observable<LicenseInfo[]> {
    const params = { firstName, lastName, isDoSearch };
    return this.httpClient.get<LicenseInfo[]>(`${this.baseUrl}/getgroupnine`, {
      params,
    });
  }

  public getGroupTen(
    firstName: string,
    lastName: string,
    isDoSearch: boolean
  ): Observable<LicenseInfo[]> {
    const params = { firstName, lastName, isDoSearch };
    return this.httpClient.get<LicenseInfo[]>(`${this.baseUrl}/getgroupten`, {
      params,
    });
  }
}
