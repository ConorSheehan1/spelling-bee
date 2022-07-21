// generic js functions
// https://levelup.gitconnected.com/lodash-methods-that-can-be-easily-implemented-in-plain-javascript-bbe22509827e
const chunk = ({
  arr,
  size,
}: {
  arr: Array<any>;
  size: number;
}): Array<Array<any>> => {
  const chunkedArr = [];
  for (let i = 0; i < arr.length; i += size) {
    chunkedArr.push(arr.slice(i, i + size));
  }
  return chunkedArr;
};

// TODO: sort alphabetically and vertically instead of horizontally?
// returns array of objects
// [{1: 'a', 2: 'b', 3:'c'}, {1:'d', 2:'e'}]
const gridify = ({
  arr,
  size,
}: {
  arr: Array<any>;
  size: number;
}): Array<Object> => {
  return chunk({ arr, size }).map((arr) => {
    const obj: { [key: string]: any } = {};
    arr.forEach((value, index: number) => {
      obj[`${index + 1}`] = value;
    });
    return obj;
  });
};

// https://stackoverflow.com/a/46545530/6305204
const shuffle = (array: Array<any>) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

// https://stackoverflow.com/a/22015771/6305204
const zip = (arr1: Array<any>, arr2: Array<any>): Array<any> => {
  return arr1.map((e, i) => {
    return [e, arr2[i]];
  });
};

const incrementDups = (arr: Array<number>): Array<number> => {
  const encounters = new Set();
  return arr.map((num) => {
    while (encounters.has(num)) {
      num += 1;
    }
    encounters.add(num);
    return num;
  });
};

export { chunk, gridify, incrementDups, shuffle, zip };
