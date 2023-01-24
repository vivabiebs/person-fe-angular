import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Form, NgForm, RequiredValidator } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { IMutationPerson } from 'src/app/interfaces/person';
import { PersonService } from 'src/app/services/person.service';
import { DEFAULT_VALUE, GENDERS, STATUS } from 'src/app/shared/data';
import { removeItem } from 'src/app/utils/filter';
import { str2enumGender, str2enumStatus } from 'src/app/utils/transform2enum';

@Component({
  selector: 'app-create-person',
  templateUrl: './create-person.component.html',
  styleUrls: [
    './create-person.component.css',
    './../../../shared/style/button-style.css',
    './../../../shared/style/box.css',
  ],
})
export class CreatePersonComponent implements OnInit, OnDestroy {
  console = console;
  genders = GENDERS.slice();
  status = STATUS.slice();
  people: IMutationPerson[] = [];

  viewPerson: IMutationPerson | undefined = DEFAULT_VALUE;

  haveChild: boolean | null = null;
  selectedStatus: string = '';
  selectedGender: string = '';
  selectedChild: IMutationPerson[] = [];
  selectedParents: IMutationPerson[] = [];
  errorMsg: string = 'null';

  peopleSubscription = new Subscription();

  @ViewChild('form', { static: true }) form!: NgForm;

  constructor(
    private router: Router,
    private personService: PersonService,
    private route: ActivatedRoute
  ) {
    this.people = this.personService.getQueriedPeople();


    const localViewPerson = localStorage.getItem('viewPerson');
    if (localViewPerson) {
      this.viewPerson = JSON.parse(localViewPerson);
      this.setupForm();
    }
  }

  ngOnInit(): void {
    if (!this.people.length) {
      this.peopleSubscription = this.personService
        .getPeople()
        .valueChanges.subscribe(({ data }) => {
          this.people = data.people;
        });
    }
    this.route.params.subscribe((params: Params) => {
      if (this.personService.getQueriedPeople().length) {
        if (!params['id']) return;

        this.viewPerson = this.personService.getPerson(params['id']);

        this.setupForm();
      }
    });

    this.genders.splice(0, 1);
    this.status.splice(0, 1);
  }

  onSubmit(form: NgForm) {
    const eGender = str2enumGender(this.selectedGender);
    const eStatus = str2enumStatus(this.selectedStatus);

    if (!form.value.firstname || !form.value.lastname || !form.value.age || !form.value.birthdate ||
      !eStatus || !eGender || this.haveChild === null) {
      let str = 'Invalid input! Please fill the form completely.';
      this.console.log(str)
      this.errorMsg = 'Invalid input! Please fill out the form completely.';
      // throw new Error('Invalid input! Please fill the form completely.');
      throw console.error('Invalid input! Please fill out the form completely.');
    }

    const person: IMutationPerson = {
      id: (+this.people[this.people.length - 1].id + 1).toString(),
      firstname: form.value.firstname,
      lastname: form.value.lastname,
      age: +form.value.age,
      birthdate: form.value.birthdate,
      status: eStatus,
      gender: Array.isArray(eGender) ? eGender[0] : eGender,
      haveChild: Boolean(this.haveChild),
      parents: this.selectedParents,
      children: this.selectedChild,
    };

    if (this.router.url.includes('create')) {
      this.personService.addPerson(person);
    } else if (this.router.url.includes('edit') && this.viewPerson) {
      person.id = this.viewPerson.id;

      this.personService.updatePerson(this.viewPerson.id, person);
      this.errorMsg = 'null';
    }
    this.clear();
  }

  setStatus(val: string) {
    this.selectedStatus = val;
  }

  setGender(val: string) {
    this.selectedGender = val;
  }

  selectChild(person: IMutationPerson) {
    let people = [...this.selectedChild, person];
    this.selectedChild = people;
  }

  removeChild(person: IMutationPerson) {
    this.selectedChild = removeItem(person.id, this.selectedChild);
  }

  selectParents(person: IMutationPerson) {
    let people = [...this.selectedParents, person];
    this.selectedParents = people;
  }

  removeParents(person: IMutationPerson) {
    this.selectedParents = removeItem(person.id, this.selectedParents);
  }

  setHaveChild(val: boolean) {
    this.haveChild = val;
  }

  clear() {
    //clear form
    this.haveChild = false;
    this.selectedChild = [];
    this.selectedParents = [];
    this.selectedStatus = '';
    this.selectedGender = '';

    this.router.navigate(['persons']);
  }

  isError() {
    return this.errorMsg !== 'null';
  }

  isViewRoute() {
    return this.router.url.includes('view');
  }

  isCreate() {
    return this.router.url.includes('create');
  }

  isEdit() {
    return this.router.url.includes('edit');
  }

  setupForm() {
    setTimeout(() => {
      if (this.viewPerson) {
        this.selectedStatus = this.viewPerson.status.valueOf().toLowerCase();
        const str =
          this.selectedStatus.charAt(0).toUpperCase() +
          this.selectedStatus.slice(1);
        this.selectedStatus = str;
        this.selectedGender = this.viewPerson.gender;
        this.haveChild = this.viewPerson.haveChild;
        this.selectedChild = this.viewPerson.children ?? [];
        this.selectedParents = this.viewPerson.parents ?? [];
        this.form.setValue({
          firstname: this.viewPerson?.firstname,
          lastname: this.viewPerson?.lastname,
          age: this.viewPerson?.age,
          birthdate: this.viewPerson?.birthdate
        });
        localStorage.setItem('viewPerson', JSON.stringify(this.viewPerson));
      }
    });
  }

  reverseDateFormat(str: string) {
    return str.split('-').reverse().join('-');
  }

  ngOnDestroy(): void {
    this.genders = GENDERS;
    this.status = STATUS;
    localStorage.removeItem('viewPerson');
  }
}
