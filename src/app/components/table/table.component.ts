import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataManagementService } from '../../services/management-data.service';
import { ModalComponent } from '../modal/modal.component';
import { ModalService } from '../../services/modal.service';
import { CommonEvent } from '../../modules/table.modules';
import { removeDuplicateKeysAndLength } from '../../utils/removeDuplicateKeysAndLength';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [RouterOutlet, DatePipe, FormsModule, CommonModule, ModalComponent],

  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  data: CommonEvent[] = [];

  constructor(
    private dataManagementService: DataManagementService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.data = this.dataManagementService.getData();
    this.checkDataDeps()
  }

  openEditPopup(item: CommonEvent): void {
    this.modalService.openModal(item, true);
  }

  openAddPopup(): void {
    this.modalService.openModal({}, false);
  }

  checkDataDeps() {
    const typesArr = this.data.map((item) => item.type)

    const fieldCounts = this.data.reduce((counts: any, obj) => {
      Object.keys(obj).forEach(key => {
        counts[key] = (counts[key] || 0) + 1;
      });
      return counts;
    }, {});
    const exceptFields = Object.keys(fieldCounts).filter(key => fieldCounts[key] !== this.data.length);
    const depsArr = this.data.map((item: any) => {
      const listOfExceptFields = exceptFields.filter((field: any) => item[field] !== undefined) 
      return {[item.type]: listOfExceptFields}
    })
    console.log(removeDuplicateKeysAndLength(depsArr))
    return (removeDuplicateKeysAndLength(depsArr), 'depsArr')
  }

  getDisplayValue(item: any): { key: string, value: string } {
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
