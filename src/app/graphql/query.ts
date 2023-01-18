import { gql } from 'apollo-angular';

const GET_PERSON = gql`
  query Person($id: ID!) {
    people(id: $id) {
      id
      firstname
      lastname
      age
      gender
      birthdate
      status
      haveChild
      children {
        id
        firstname
        lastname
        age
        gender
        birthdate
        status
        haveChild
      }
      parents {
        id
        firstname
        lastname
        age
        gender
        birthdate
        status
        haveChild
      }
    }
  }
`;

const GET_PEOPLE = gql`
  query People {
    people {
      id
      firstname
      lastname
      age
      gender
      birthdate
      status
      haveChild
      children {
        id
        firstname
        lastname
        age
        gender
        birthdate
        status
        haveChild
      }
      parents {
        id
        firstname
        lastname
        age
        gender
        birthdate
        status
        haveChild
      }
    }
  }
`;

const GET_FILTERED_PEOPLE = gql`
  query People($filter: PersonFilterInput) {
    people(filter: $filter) {
      id
      firstname
      lastname
      age
      gender
      birthdate
      children {
        id
        firstname
        lastname
        age
        gender
        birthdate
      }
      parents {
        id
        firstname
        lastname
        age
        gender
        birthdate
      }
    }
  }
`;

export { GET_PEOPLE, GET_FILTERED_PEOPLE, GET_PERSON };
