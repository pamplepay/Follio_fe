import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionStorageService } from '../../module/storage/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private selectedCustomer$ = new BehaviorSubject(null);

  constructor(
    private _sessionStorage:SessionStorageService,
  ) {
    const customer = this._sessionStorage.get('selectedCustomer');
    this.selectedCustomer$.next(customer);
  }

  rxSelectedCustomer() {
    return this.selectedCustomer$;
  }

  setSelectedCustomer(customer) {
    this._sessionStorage.set('selectedCustomer', customer);
    this.selectedCustomer$.next(customer);
  }

}
