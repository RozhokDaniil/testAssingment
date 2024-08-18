import { Component } from '@angular/core';
import { DataManagementService } from '../../services/management-data.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { DescriptionService } from '../../services/description.service';
import { PipesModule } from '../../pipes/pipes/pipes.module';

export interface FieldDefinition {
  key: string;
  type: 'text' | 'number' | 'date' | 'checkbox';
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PipesModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
 
})

export class ModalComponent {
  item: any = {};
  isEdit: boolean = false;
  showModal: boolean = false;
  form: FormGroup;
  eventTypes: string[] = []
  private initialTypeValue: string = '';
  fieldDefinitions: FieldDefinition[] = [];
  commonFields: any[] = []

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
      this.isEdit = state.isEdit;
      this.showModal = state.show;
      this.convertDatesToISO()
      this.form = this.descriptionService.initializeForm(this.item, this.isEdit);
      this.displayArr = this.descriptionService.getDisplayValues(this.item, this.isEdit)
      this.eventTypes = this.dataManagementService.eventTypes
      this.fieldDefinitions = this.dataManagementService.getTypes(this.item);
      this.commonFields = this.dataManagementService.commonFields.filter(field => field !== 'type' && field !== 'eventId');
    });
  }

  objChanged(event: string) {
    if(event === this.initialTypeValue){
      return 
    }
    this.isEdit ? this.openConfirmationModal(event) : this.executeObjChanged(event)
  }

  private openConfirmationModal(event: string) {
    this.modalService.openConfirmationModal();
    this.modalService.confirmation$.subscribe(state => {
      if (state.isConfirmed === null) {
      } else if (state.isConfirmed) {
        this.executeObjChanged(event);
        this.initialTypeValue = this.item.type
      } else {
        this.form.patchValue({ type: this.initialTypeValue });
      }
    });
  }

  private executeObjChanged(event: string) {
    this.item = this.form.value
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
    this.form = this.descriptionService.initializeForm(this.item, this.isEdit);
  }

  private updateDisplayArr(): void {
    this.displayArr = this.descriptionService.getDisplayValues(this.item);
    this.fieldDefinitions = this.dataManagementService.getTypes(this.item);
  }

  getFieldType(key: string): 'text' | 'number' | 'date' | 'checkbox' {
    const fieldDefinition = this.fieldDefinitions.find(field => field.key === key);
    return fieldDefinition ? fieldDefinition.type : 'text';
  }

  convertDatesToISO(): void {
    Object.keys(this.item).forEach(key => {
      if (this.getFieldType(key) === 'date' && this.item[key]) {
        this.item[key] = this.convertTimestampToDate(this.item[key]);
      }
    });
  }

  convertTimestampToDate(input: any): string {
    if (typeof input === 'string') {
      const date = new Date(input);
      if (isNaN(date.getTime())) {
        console.error(`Invalid date string: ${input}`);
        return '';
      }
      return date.toISOString().split('T')[0];
    } else if (typeof input === 'number') {
      const milliseconds = input > 10000000000 ? input : input * 1000;
      const date = new Date(milliseconds);
      if (isNaN(date.getTime())) {
        console.error(`Invalid timestamp: ${input}`);
        return '';
      }
      return date.toISOString().split('T')[0];
    } else {
      console.error(`Unsupported date input: ${input}`);
      return '';
    }
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

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
