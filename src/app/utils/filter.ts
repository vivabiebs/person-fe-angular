const filterDuplicate = (data: string, arr: string[]) => {
  let filtered: string[] = [];
  let isDuplicate: boolean = false;
  arr.forEach((a) => {
    if (a === data) {
      isDuplicate = true;
    } else {
      filtered.push(a);
    }
  });
  if (!isDuplicate) {
    filtered.push(data);
  }
  return filtered;
};

const removeItem = (data: string, arr: any[]) => {
  let remain: any[] = [];
  const index = arr.findIndex((a) => a.id === data);
  remain = arr.slice();
  remain.splice(index, 1);
  return remain;
};

export { filterDuplicate, removeItem };
