import { gql } from 'apollo-angular';

const CREATED = gql`
  subscription createPerson {
    createPerson {
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

const DELETED = gql`
  subscription deletePerson {
    deletePerson {
      id
    }
  }
`;

const UPDATED = gql`
  subscription updatePerson {
    updatePerson {
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

export { DELETED, CREATED, UPDATED };
