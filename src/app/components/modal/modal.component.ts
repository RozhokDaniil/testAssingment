import { Component, Input } from '@angular/core';
import { DataManagementService } from '../../services/management-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  item: any = {};
  originalItem: any = {}; 
  isEdit: boolean = false;
  showModal: boolean = false;

  constructor(
    private modalService: ModalService,
    private dataManagementService: DataManagementService
  ) { }

  ngOnInit(): void {
    this.modalService.modalState$.subscribe(state => {
      this.item = { ...state.item }; 
      this.originalItem = state.item;
      this.isEdit = state.isEdit;
      this.showModal = state.show;
    });
  }

  onSave(): void {
    if (this.isEdit) {
      this.dataManagementService.updateItem(this.item).subscribe()
    } else {
      this.dataManagementService.addItem(this.item).subscribe()
    }
    this.closeModal();
  }

  onCancel(): void {
    this.closeModal();
  }

  onDelete(): void {
    this.dataManagementService.deleteItem(this.item.eventId).subscribe()
    this.closeModal();
  }

  private closeModal(): void {
    this.modalService.closeModal();
  }

  public onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).id === 'editPopup') {
      this.closeModal();
    }
  }
}
