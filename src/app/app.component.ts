import { Component, inject, signal, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { LicenseInfo } from './LicenseInfo';
import { LookupService } from './lookup.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  PaymentIntent,
} from '@stripe/stripe-js';
import { PaymentsService } from './payments.service';
import {
  catchError,
  finalize,
  from,
  mergeMap,
  of,
  scan,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  displayedColumns: string[] = [
    'state',
    'name',
    'licenseNumber',
    'licenseStatus',
    'licenseExpiration',
    'errorMessage',
  ];

  dataSource = new MatTableDataSource<LicenseInfo>();
  searchForm: FormGroup;
  loading = false;
  hasPaid = false;
  showPayment = false;

  @ViewChild(StripeCardNumberComponent)
  card!: StripeCardNumberComponent;

  public cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        fontWeight: 400,
        fontFamily: 'Circular',
        fontSize: '14px',
        iconColor: '#666EE8',
        color: '#002333',
        '::placeholder': {
          color: '#919191',
        },
      },
    },
  };

  public elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  paymentForm: FormGroup = this.formBuilder.group({
    name: 'John',
    email: 'john@gmail.com',
    amount: 15,
  });

  constructor(
    private _lookupService: LookupService,
    private formBuilder: FormBuilder,
    private stripeService: StripeService,
    private paymentsService: PaymentsService
  ) {
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
    const isDoSearch: boolean = this.searchForm.get('mdOrDo')?.value! === 'DO';

    const apiCalls = [
      this._lookupService.getGroupOne(firstName, lastName, isDoSearch),
      this._lookupService.getGroupTwo(firstName, lastName, isDoSearch),
      this._lookupService.getGroupThree(firstName, lastName, isDoSearch),
      this._lookupService.getGroupFour(firstName, lastName, isDoSearch),
      this._lookupService.getGroupFive(firstName, lastName, isDoSearch),
      this._lookupService.getGroupSix(firstName, lastName, isDoSearch),
      this._lookupService.getGroupSeven(firstName, lastName, isDoSearch),
      this._lookupService.getGroupEight(firstName, lastName, isDoSearch),
      this._lookupService.getGroupNine(firstName, lastName, isDoSearch),
      this._lookupService.getGroupTen(firstName, lastName, isDoSearch),
    ];

    from(apiCalls)
      .pipe(
        mergeMap(
          (call) =>
            call.pipe(
              catchError((error) => of([])) // return empty array to keep the stream alive
            ),
          10
        ),
        scan(
          (acc: LicenseInfo[], value: LicenseInfo[]) => [...acc, ...value],
          []
        ),
        finalize(() => (this.loading = false))
      )
      .subscribe((accumulatedResults) => {
        this.dataSource.data = accumulatedResults;
      });
  }

  exportToCSV(): void {
    const csvData = Papa.unparse({
      fields: [
        'State',
        'License Number',
        'Status',
        'Expiration',
        'Error Message',
      ],
      data: this.dataSource.data.map((info) => [
        info.state,
        info.licenseNumber,
        info.licenseStatus,
        info.licenseExpiration,
        info.errorMessage,
      ]),
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
      body: this.dataSource.data.map((info) => [
        info.state,
        info.licenseNumber,
        info.licenseStatus,
        info.licenseExpiration,
      ]),
    });

    doc.save('LicenseData.pdf');
  }

  pay(): void {
    if (this.paymentForm.valid) {
      this.paymentsService
        .createPaymentIntent(this.paymentForm.get('amount')!.value)
        .pipe(
          switchMap((clientSecret) =>
            this.stripeService.confirmCardPayment(clientSecret, {
              payment_method: {
                card: this.card.element,
                billing_details: {
                  name: this.paymentForm.get('name')!.value,
                },
              },
            })
          )
        )
        .subscribe((result) => {
          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            console.log(result.error.message);
          } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
              this.hasPaid = true;
            }
          }
        });
    } else {
      console.log(this.paymentForm);
    }
  }
}
