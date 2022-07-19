// generic js functions
// https://levelup.gitconnected.com/lodash-methods-that-can-be-easily-implemented-in-plain-javascript-bbe22509827e
const chunk = ({ arr, size }) => {
  const chunkedArr = [];
  for (let i = 0; i < arr.length; i += size) {
    chunkedArr.push(arr.slice(i, i + size));
  }
  return chunkedArr;
};

// TODO: sort alphabetically and vertically instead of horizontally?
// returns array of objects
// [{1: 'a', 2: 'b', 3:'c'}, {1:'d', 2:'e'}]
const gridify = ({ arr, size }) => {
  return chunk({ arr, size }).map((arr) => {
    const obj = {};
    arr.forEach((value, index) => {
      obj[`${index + 1}`] = value;
    });
    return obj;
  });
};

// https://stackoverflow.com/a/46545530/6305204
const shuffle = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

// https://stackoverflow.com/a/22015771/6305204
const zip = (arr1, arr2) => {
  return arr1.map((e, i) => {
    return [e, arr2[i]];
  });
};

const incrementDups = (arr) => {
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
