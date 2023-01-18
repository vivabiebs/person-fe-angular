import { Gender, Status } from '../interfaces/person';

const str2enumGender = (gender: string[] | string) => {
  const resultsGender: Gender[] = [];
  if (typeof gender === 'string') {
    let res: Gender = (<any>Gender)[gender.toUpperCase()];
    return res;
  } else {
    gender.forEach((d) => {
      let enumValue: Gender = (<any>Gender)[d.toUpperCase()];
      resultsGender.push(enumValue);
    });
    return resultsGender;
  }
};

const str2enumStatus = (status: string) => {
  let result: Status;
  if (status === '') {
    return Status.SINGLE;
  }
  result = (<any>Status)[status.toUpperCase()];
  return result;
};

export { str2enumGender, str2enumStatus };
