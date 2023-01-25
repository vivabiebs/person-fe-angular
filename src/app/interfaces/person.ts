export interface IPerson {
  id: string;
  firstname: string;
  lastname: string;
  age: number;
  gender: Gender;
  status: Status;
  birthdate: string;
  haveChild: boolean;
  children?: string[];
  parents?: string[];
}

export interface IPersonForCreate {
  firstname: string;
  lastname: string;
  age: number;
  gender: Gender;
  status: Status;
  birthdate: string;
  haveChild: boolean;
  children?: number[];
  parents?: number[];
}

export interface IFilter {
  age: number;
  status: string;
  gender: string[];
}
export interface IMutationPerson {
  id: string;
  firstname: string;
  lastname: string;
  age: number;
  gender: Gender;
  status: Status;
  birthdate: string;
  haveChild: boolean;
  children?: IMutationPerson[];
  parents?: IMutationPerson[];
}

export interface IPersonUpdate {
  firstname: string;
  lastname: string;
  age: number;
  gender: Gender;
  status: Status;
  birthdate: string;
  haveChild: boolean;
  children?: IMutationPerson[];
  parents?: IMutationPerson[];
}

export enum Gender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  OTHER = 'OTHER',
}

export enum Status {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
}
