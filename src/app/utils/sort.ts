const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base"
});

const reverseDateFormat = (str: string) => {
    return str.split('-').reverse().join('-');
}

const compareByProperty = (a: any, b: any, sortASC: boolean, property: PropertyKey) => {
    if (property === 'age') property = "birthdate";
    if (sortASC) {
        if (property === 'birthdate') {
            return collator.compare(reverseDateFormat(b[property]), reverseDateFormat(a[property]));
        }
        return collator.compare(b[property], a[property]);
    }
    if (property === 'birthdate') {
        return collator.compare(reverseDateFormat(a[property]), reverseDateFormat(b[property]));
    }
    return collator.compare(a[property], b[property]);
}

export { reverseDateFormat, compareByProperty }