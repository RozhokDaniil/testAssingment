import { Component } from '@angular/core';
import { DataManagementService } from '../../services/management-data.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { DescriptionService } from '../../services/description.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  item: any = {};
  originalItem: any = {}; 
  isEdit: boolean = false;
  showModal: boolean = false;

  displayArr: any = null
  form: any = FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private descriptionService: DescriptionService,
    private dataManagementService: DataManagementService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({});
    this.modalService.modalState$.subscribe(state => {
      this.item = { ...state.item }; 
      this.originalItem = state.item;
      this.isEdit = state.isEdit;
      this.showModal = state.show;
      const display = this.descriptionService.getDisplayValues(this.item);
      console.log(display, 'display')
      console.log(this.item, 'this.item')
      this.displayArr = display.length ? display : [display]
      this.displayArr?.forEach((display: any) => {
        this.form.addControl(display.key, this.fb.control(display.value || ''));
      });
    });
    
  }

  onSave(): void {
    // this.descriptionService.parseDescription(this.item, `${this.displayKey}: ${this.displayValue}`);
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
