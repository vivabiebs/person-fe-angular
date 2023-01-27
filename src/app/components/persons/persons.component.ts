import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { GET_PEOPLE } from 'src/app/graphql/query';
import {
  CREATED,
  DELETED,
  UPDATED,
} from 'src/app/graphql/subscription';
import { IMutationPerson, IPersonForCreate } from 'src/app/interfaces/person';
import { PersonService } from 'src/app/services/person.service';
import { filterDuplicate } from 'src/app/utils/filter';
import { compareByProperty } from 'src/app/utils/sort';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: [
    './persons.component.css',
    './../../shared/style/button-style.css',
    './../../shared/style/box.css',
  ],
})
export class PersonsComponent implements OnInit, OnDestroy {
  console = console;
  private peopleSubscription: Subscription = new Subscription();
  private filteredPeopleSubscription: Subscription = new Subscription();
  private clearFormSubscription: Subscription = new Subscription();
  private collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base"
  });

  people: IMutationPerson[] = [];
  selectedPeople: string[] = [];
  isASC: boolean = false;

  constructor(
    private personService: PersonService,
    private router: Router,
    private apollo: Apollo
  ) {
    this.apollo
      .subscribe<{ deletePerson: { id: string } }>({
        query: DELETED,
      })
      .subscribe((result) => {
        if (result.data) {
          console.log('In delete subscription');
          this.apollo.client.refetchQueries({ include: [GET_PEOPLE] });
        }
      });
    this.apollo
      .subscribe<{ createPerson: IPersonForCreate }>({
        query: CREATED,
      })
      .subscribe((result) => {
        if (result.data) {
          console.log('In create subscription');
          this.apollo.client.refetchQueries({ include: [GET_PEOPLE] });
        }
      });
    this.apollo
      .subscribe<{ updatePerson: IMutationPerson }>({
        query: UPDATED,
      })
      .subscribe((result) => {
        if (result.data) {
          this.apollo.client.refetchQueries({ include: [GET_PEOPLE] });
        }
      });
  }

  ngOnInit(): void {
    this.peopleSubscription = this.personService
      .getPeople()
      .valueChanges.subscribe((result) => {
        this.people = result.data.people;
        console.log('get ALL people');
        this.personService.setPeople(result.data.people);
      });
    this.filteredPeopleSubscription =
      this.personService.fitleredPeople.subscribe(({ age, status, gender }) => {
        this.personService
          .filterPeople(age, status, gender)
          .valueChanges.subscribe(({ data }) => {
            this.people = data.people;
          });
      });
    this.clearFormSubscription = this.personService.clearForm.subscribe(() => {
      this.people = this.personService.getQueriedPeople();
    });
  }


  reverseDateFormat(str: string) {
    return str.split('-').reverse().join('-');
  }

  changeToCapitalize(string: string) {
    return string.slice(0, 1).concat(string.substring(1, string.length).toLowerCase());
  }

  sort(field: string) {
    let arrayForSort = [...this.people];
    console.log("sort by " + field)
    arrayForSort.sort((a, b) => compareByProperty(a, b, this.isASC, field));
    this.people = arrayForSort;
    this.isASC = !this.isASC;
  }

  select(index: number) {
    this.selectedPeople = filterDuplicate(
      index.toString(),
      this.selectedPeople
    );
  }

  routeTo() {
    this.router.navigate(['person/create']);
  }

  deletePerson() {
    this.personService.deletePerson(+this.selectedPeople[0]);
    this.selectedPeople = [];
  }

  viewPerson() {
    this.router.navigate(['person/view', this.selectedPeople[0]]);
  }

  editPerson() {
    this.router.navigate(['person/edit', this.selectedPeople[0]]);
  }

  ngOnDestroy(): void {
    this.peopleSubscription.unsubscribe();
    this.filteredPeopleSubscription.unsubscribe();
    this.clearFormSubscription.unsubscribe();
  }
}
