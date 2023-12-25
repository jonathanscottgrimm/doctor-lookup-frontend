import { Component } from '@angular/core';
import { LicenseInfo } from './LicenseInfo';
import { LookupService } from './lookup.service';
import {MatTableDataSource} from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  displayedColumns: string[] = ['state', 'licenseNumber', 'licenseStatus', 'licenseExpiration', 'errorMessage'];
  dataSource = new MatTableDataSource<LicenseInfo>();
  searchForm: FormGroup;
  loading = false;

  constructor(private _lookupService: LookupService, private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      mdOrDo: new FormControl(''),
    });
  }

  getLicenseInfo(): void {
    this.loading = true;

    const firstName = this.searchForm.get('firstName')?.value!;
    const lastName = this.searchForm.get('lastName')?.value!;
    const isDoSearch: boolean = this.searchForm.get('mdOrDo')?.value! === "DO";


    this._lookupService.GetLicenseInfo(lastName, firstName, isDoSearch).subscribe(
      (data: LicenseInfo[]) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error => {
        console.error('Error fetching data:', error);
        this.loading = false;
      }
    );
  }

  exportToCSV(): void {
    const csvData = Papa.unparse({
      fields: ['State', 'License Number', 'Status', 'Expiration', 'Error Message'],
      data: this.dataSource.data.map(info => [info.state, info.licenseNumber, info.licenseStatus, info.licenseExpiration, info.errorMessage]),
    });

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'LicenseData.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    const columns = ['State', 'License Number', 'Status', 'Expiration'];

    autoTable(doc, {
      head: [columns],
      body: this.dataSource.data.map(info => [info.state, info.licenseNumber, info.licenseStatus, info.licenseExpiration]),
    });

    doc.save('LicenseData.pdf');
  }
}

