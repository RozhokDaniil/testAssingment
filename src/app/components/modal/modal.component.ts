import { Component } from '@angular/core';
import { DataManagementService } from '../../services/management-data.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { DescriptionService } from '../../services/description.service';

export interface FieldDefinition {
  key: string;
  type: 'text' | 'number' | 'date' | 'checkbox';
}

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
  form: FormGroup;
  eventTypes: string[] = []
  private initialTypeValue: string = '';
  fieldDefinitions: FieldDefinition[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private descriptionService: DescriptionService,
    private dataManagementService: DataManagementService
  ) {
    this.form = this.fb.group({});
  }

  displayArr: any = null

  ngOnInit(): void {
    this.modalService.modalState$.subscribe(state => {
      this.item = { ...state.item };
      this.initialTypeValue = state.item.type
      this.originalItem = state.item;
      this.isEdit = state.isEdit;
      this.showModal = state.show;
      this.form = this.descriptionService.initializeForm(this.item);
      this.displayArr = this.descriptionService.getDisplayValues(this.item, this.isEdit)
      this.eventTypes = this.dataManagementService.eventTypes
       this.fieldDefinitions = this.dataManagementService.getTypes(this.item);
    });
  }

  objChanged(event: string) {
    this.isEdit ? this.openConfirmationModal(event) : this.executeObjChanged(event)
  }

  private openConfirmationModal(event: string) {
    this.modalService.openConfirmationModal();
    this.modalService.confirmation$.subscribe(state => {
      if (state.isConfirmed === null) {
      } else if (state.isConfirmed) {
        console.log('state.isConfirmed')
        this.executeObjChanged(event);
      } else {
        this.item.type = this.initialTypeValue;
      }
    });
  }

  private executeObjChanged(event: string) {
    Object.keys(this.item).forEach(key => {
      if (!this.dataManagementService.commonFields.includes(key)) {
        delete this.item[key];
      }
    });
    const missedDeps = this.dataManagementService.checkDataDeps()[event];
    missedDeps.forEach((field) => {
      this.item[field] = undefined;
    });
    this.updateDisplayArr();
    this.form = this.descriptionService.initializeForm(this.item);
  }

  private updateDisplayArr(): void {
    this.displayArr = this.descriptionService.getDisplayValues(this.item);
    this.fieldDefinitions = this.dataManagementService.getTypes(this.item);
  }

  getFieldType(key: string): 'text' | 'number' | 'date' | 'checkbox' {
    const fieldDefinition = this.fieldDefinitions.find(field => field.key === key);
    return fieldDefinition ? fieldDefinition.type : 'text';
  }

  onSave(): void {
    this.item = { ...this.item, ...this.form.value };
    this.descriptionService.parseDescription(this.item, this.displayArr);
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
