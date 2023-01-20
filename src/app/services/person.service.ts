import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs';
import {
  CREATE_PERSON,
  DELETE_PERSON,
  UPDATE_PERSON,
} from '../graphql/mutation';
import {
  GET_FILTERED_PEOPLE,
  GET_PEOPLE,
  GET_PERSON,
} from '../graphql/query';
import { str2enumGender, str2enumStatus } from '../utils/transform2enum';
import {
  Gender,
  IFilter,
  IMutationPerson,
  IPerson,
  IPersonUpdate,
  Status,
} from './../interfaces/person';

@Injectable({ providedIn: 'root' })
export class PersonService implements OnInit {
  fitleredPeople = new Subject<IFilter>();
  clearForm = new Subject<boolean>();
  private people: IMutationPerson[] = [];
  persons = new Subject<IPerson[]>();

  constructor(private apollo: Apollo, private router: Router) { }

  ngOnInit(): void { }

  getPeople() {
    return this.apollo.watchQuery<{ people: IMutationPerson[] }>({
      query: GET_PEOPLE,
    });
  }

  getPerson(id: string) {
    let person: IMutationPerson;
    const personIndex = this.people.findIndex((p) => {
      return p.id === id;
    });

    if (personIndex === -1) {
      this.apollo
        .query<{ person: IMutationPerson }>({
          query: GET_PERSON,
          variables: {
            id,
          },
        })
        .subscribe(({ data }) => {
          person = data.person;

          return person;
        });
    } else {
      person = this.people[personIndex];
      return person;
    }
    return undefined;
  }

  filterPeople(age: number, status: string, gender: string[]) {
    let genderparams: Gender[] | Gender | null;
    let statusparams: Status | null;
    genderparams = gender.length ? str2enumGender(gender) : null;
    statusparams = status.length ? str2enumStatus(status) : null;

    return this.apollo.watchQuery<{ people: IMutationPerson[] }>({
      query: GET_FILTERED_PEOPLE,
      variables: {
        filter: {
          age,
          status: statusparams,
          gender: genderparams,
        },
      },
    })
  }

  getQueriedPeople() {
    return this.people;
  }

  setPeople(people: IMutationPerson[]) {
    this.people = people;
  }

  addPerson(person: IMutationPerson) {
    console.log(person)
    console.log('Add person');
    this.apollo
      .mutate<{ createPerson: IMutationPerson }>({
        mutation: CREATE_PERSON,
        variables: { input: { ...person } },
        update: (cache) => {
          const existingPeople: any = cache.readQuery({ query: GET_PEOPLE });
          cache.writeQuery({
            query: GET_PEOPLE,
            data: { people: [...existingPeople.people, person] },
          });
        },
      })
      .subscribe(() => {
        this.router.navigate(['persons']);
      });
  }

  deletePerson(index: number) {
    this.apollo
      .mutate<{ deletePerson: { id: string } }>({
        mutation: DELETE_PERSON,
        variables: {
          id: index,
        },
        update: (cache) => {
          const existingPeople: any = cache.readQuery({ query: GET_PEOPLE });
          const remain = existingPeople.people.filter((p: IMutationPerson) => {
            return +p.id !== index;
          });

          cache.writeQuery({
            query: GET_PEOPLE,
            data: { people: remain },
          });
        },
      })
      .subscribe(({ data }) => {
        this.router.navigate(['persons']);
      });
  }

  updatePerson(id: string, input: IPersonUpdate) {
    console.log('UPDATE person')
    this.apollo
      .mutate<{ updatePerson: IMutationPerson }>({
        mutation: UPDATE_PERSON,
        variables: {
          id,
          input,
        },
        update: (cache) => {
          const existingPeople: any = cache.readQuery({ query: GET_PEOPLE });
          const index = existingPeople.people.findIndex(
            (p: IMutationPerson) => {
              return p.id === id;
            }
          );
          const people = existingPeople.people.slice();
          people[index] = { ...input };
          cache.writeQuery({
            query: GET_PEOPLE,
            data: { people, type: 'UPDATE' },
          });
        },
      })
      .subscribe(({ data }) => {
        this.router.navigate(['persons']);
      });
  }
}
