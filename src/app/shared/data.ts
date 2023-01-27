import { Gender, IMutationPerson, Status } from '../interfaces/person';

const GENDERS = ['All', 'Female', 'Male', 'Other'];
const STATUS = ['All', 'Single', 'Married'];

const DEFAULT_VALUE: IMutationPerson = {
  id: '',
  firstname: '',
  lastname: '',
  age: 0,
  gender: Gender.FEMALE,
  status: Status.SINGLE,
  birthdate: '',
  haveChild: false,
  children: [],
  parents: [],
};

export { GENDERS, STATUS, DEFAULT_VALUE };
