import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataManagementService } from '../../services/management-data.service';
import { ModalComponent } from '../modal/modal.component';
import { ModalService } from '../../services/modal.service';

interface Item {
  newGroupName?: string
  heatIndexPeak?: number
  cowEntryStatus?: string
  duration?: number
  lactationNumber?: number
  ageInDays?: number
  type?: string
  startDateTime?: string
  eventId?: number
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [RouterOutlet, DatePipe, FormsModule, CommonModule, ModalComponent],

  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  data: Item[] = [];

  constructor(
    private dataManagementService: DataManagementService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.data = this.dataManagementService.getData();
  }

  openEditPopup(item: Item): void {
    this.modalService.openModal(item, true);
  }

  openAddPopup(): void {
    this.modalService.openModal({}, false);
  }

  getDisplayValue(item: Item): { key: string, value: string } {
    if (item.newGroupName !== undefined) {
      return { key: 'New Group', value: item.newGroupName };
    } else if (item.heatIndexPeak !== undefined) {
      return { key: 'Heat Index Peak', value: item.heatIndexPeak.toString() };
    } else if (item.cowEntryStatus !== undefined) {
      return { key: 'Cow Entry Status', value: item.cowEntryStatus.toString() };
    } else if (item.duration !== undefined) {
      return { key: 'Duration', value: item.duration.toString() };
    } else if (item.lactationNumber !== undefined) {
      return { key: 'Lactation Number', value: item.lactationNumber.toString() };
    } else {
      return { key: 'No Data', value: 'No Data' };
    }
  }
}
