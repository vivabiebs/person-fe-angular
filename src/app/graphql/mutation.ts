import { gql } from 'apollo-angular';

const CREATE_PERSON = gql`
  mutation CreatePerson($input: CreatePersonInput) {
    createPerson(input: $input) {
      id
      firstname
      lastname
      age
      gender
      status
      birthdate
      haveChild
      parents {
        firstname
        id
        lastname
        age
        gender
        status
        birthdate
      }
      children {
        id
        firstname
        lastname
        age
        gender
        status
        birthdate
      }
    }
  }
`;

const DELETE_PERSON = gql`
  mutation DeletePerson($id: ID!) {
    deletePerson(id: $id) {
      id
    }
  }
`;

const UPDATE_PERSON = gql`
  mutation UpdatePerson($id: ID!, $input: UpdatePersonInput) {
    updatePerson(id: $id, input: $input) {
      id
      firstname
      lastname
      age
      gender
      status
      birthdate
      haveChild
      parents {
        firstname
        id
        lastname
        age
        gender
        status
        birthdate
      }
      children {
        id
        firstname
        lastname
        age
        gender
        status
        birthdate
      }
    }
  }
`;

export { CREATE_PERSON, DELETE_PERSON, UPDATE_PERSON };
