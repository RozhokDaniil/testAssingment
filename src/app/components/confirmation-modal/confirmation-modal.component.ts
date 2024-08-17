import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',

  imports: [NgClass],
  standalone: true,
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent {
  message: string = 'Are you sure you want to proceed?';
  showModal: boolean = false;


  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.modalService.confirmation$.subscribe(state => {
      this.showModal = state.show;
    });
  }

  confirm() {
    this.modalService.confirmAction(); 
  }

  cancel() {
    this.modalService.closeConfirmationModal(); 
  }
}
