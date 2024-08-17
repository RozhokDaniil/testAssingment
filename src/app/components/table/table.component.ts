import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataManagementService } from '../../services/management-data.service';
import { ModalComponent } from '../modal/modal.component';
import { ModalService } from '../../services/modal.service';
import { CommonEvent } from '../../modules/table.modules';
import { DescriptionService } from '../../services/description.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [RouterOutlet, DatePipe, FormsModule, CommonModule, ModalComponent, ConfirmationModalComponent],

  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  data: CommonEvent[] = [];
  getDisplayValue: any

  constructor(
    private dataManagementService: DataManagementService,
    private modalService: ModalService,
    private descriptionService: DescriptionService
  ) { 
    this.getDisplayValue = this.descriptionService.getDisplayValue
  }
  
  ngOnInit(): void {
    this.data = this.dataManagementService.getData();
  }

  openEditPopup(item: CommonEvent): void {
    this.modalService.openModal(item, true);
  }

  openAddPopup(): void {
    this.modalService.openModal({}, false);
  }
}
