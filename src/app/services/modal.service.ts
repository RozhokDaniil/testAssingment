import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalState = new BehaviorSubject<{ show: boolean, item: any, isEdit: boolean }>({
    show: false,
    item: {},
    isEdit: false
  });
  private confirmationState = new BehaviorSubject<{ show: boolean, isConfirmed: boolean | null }>({
    show: false,
    isConfirmed: null
  });

  modalState$ = this.modalState.asObservable();
  confirmation$ = this.confirmationState.asObservable();

  openModal(item: any, isEdit: boolean = false) {
    this.modalState.next({ show: true, item, isEdit });
  }

  openConfirmationModal() {
    this.confirmationState.next({show: true, isConfirmed: null});
    return this.confirmation$;
  }

  confirmAction() {
    this.confirmationState.next({show: false, isConfirmed: true});
  }

  closeModal() {
    this.modalState.next({ show: false, item: {}, isEdit: false });
  }

  closeConfirmationModal() {
    this.confirmationState.next({show: false, isConfirmed: false});
  }
}
