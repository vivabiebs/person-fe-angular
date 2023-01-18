import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PersonService } from 'src/app/services/person.service';
import { GENDERS, STATUS } from 'src/app/shared/data';
import { filterDuplicate } from 'src/app/utils/filter';

@Component({
  selector: 'app-filter-person',
  templateUrl: './filter-person.component.html',
  styleUrls: [
    './filter-person.component.css',
    './../../../shared/style/button-style.css',
    './../../../shared/style/box.css',
  ],
})
export class FilterPerson implements OnInit {
  genders = GENDERS;
  status = STATUS;
  age: number = 0;
  selectedGender: string[] = [];
  selectedStatus: string = '';
  isClear: boolean = false;
  isAllGender: boolean = false;

  constructor(private personService: PersonService) {}

  ngOnInit(): void {}

  search() {
    const value = {
      age: this.age,
      status: this.selectedStatus === 'All' ? '' : this.selectedStatus,
      gender: this.selectedGender.includes('All') ? [] : this.selectedGender,
    };

    this.personService.fitleredPeople.next({
      age: this.age,
      status: this.selectedStatus,
      gender: this.selectedGender,
    });
  }

  clearForm(form: NgForm) {
    this.isClear = true;
    this.age = 0;
    this.selectedGender = [];
    this.selectedStatus = '';
    this.isAllGender = false;
    this.personService.clearForm.next(true);
  }

  selectGender(gender: string) {
    if (gender === 'All') {
      this.isAllGender = !this.isAllGender;
      this.selectedGender = [];
    } else {
      this.selectedGender = filterDuplicate(gender, this.selectedGender);
    }
  }
  selectStatus(status: string) {
    this.selectedStatus = status;
  }
}
