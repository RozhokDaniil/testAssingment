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

  modalState$ = this.modalState.asObservable();

  openModal(item: any, isEdit: boolean = false) {
    this.modalState.next({ show: true, item, isEdit });
  }

  closeModal() {
    this.modalState.next({ show: false, item: {}, isEdit: false });
  }
}
