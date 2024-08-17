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
  form: FormGroup;
  eventTypes: string[] = []

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
      this.originalItem = state.item;
      this.isEdit = state.isEdit;
      this.showModal = state.show;
      this.form = this.descriptionService.initializeForm(this.item);
      this.displayArr = this.descriptionService.getDisplayValues(this.item)
      this.eventTypes = this.dataManagementService.eventTypes
      console.log(this.displayArr, 'displayArr')
      console.log(this.item, 'item')
    });
  }

  objChanged(event: string){
    const bla = this.dataManagementService.exceptFields.map((field) => delete this.item[field])
    const missedDeps = this.dataManagementService.checkDataDeps()[event]
    missedDeps.forEach((field) => {
      this.item[field] = undefined
    })
    this.updateDisplayArr()
    console.log(this.item)
    this.form = this.descriptionService.initializeForm(this.item)
  }

  private updateDisplayArr(): void {
    this.displayArr = this.descriptionService.getDisplayValues(this.item);
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
