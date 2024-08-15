import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent implements OnInit {
  data: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getData().subscribe(response => {
      this.data = response;
      console.log(response)
    });
    // this.dataService.postData({antihype: true}).subscribe(response => {
    //   this.data = response;
    //   console.log(response)
    // });

  }

  addItem() {
    const newItem = {
      healthIndex: 90,
      type: 'systemHealth',
      cowId: 999,
      animalId: '999',
      eventId: 99999,
      deletable: true,
      lactationNumber: 1,
      daysInLactation: 100,
      ageInDays: 300,
      startDateTime: Date.now(),
      reportingDateTime: Date.now()
    };
    this.dataService.postData(newItem).subscribe(response => {
      console.log('Added:', response);
      this.ngOnInit();
    });
  }

  updateItem() {
    const updatedItem = {
      healthIndex: 95,
      type: 'systemHealth',
      cowId: 636,
      animalId: '624',
      eventId: 34720,
      deletable: true,
      lactationNumber: 5,
      daysInLactation: 100,
      ageInDays: 2105,
      startDateTime: Date.now(),
      reportingDateTime: Date.now()
    };
    this.dataService.putData(updatedItem).subscribe(response => {
      console.log('Updated:', response);
      this.ngOnInit();
    });
  }

  deleteItem() {
    const idToDelete = 34720;
    this.dataService.deleteData(idToDelete).subscribe(() => {
      console.log('Deleted:', idToDelete);
      this.ngOnInit();
    });
  }
}
