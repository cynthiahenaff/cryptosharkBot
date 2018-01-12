const myArray = [
  5,
  10,
  9,
  2,
  8
];

console.log(myArray);
myArray.sort();
console.log(myArray);
myArray.sort((a, b) => { return a - b; });
console.log(myArray);
console.log('------------------------------------');


const myArray2 = [
  { name: 'Bitcoin', value: 15000 },
  { name: 'Ethereum', value: 1000 },
  { name: 'Ripple', value: 2 }
];

console.log(myArray2);
myArray2.sort((a, b) => { return a.value - b.value; });
console.log(myArray2);
console.log('------------------------------------');



const myArray3 = [
  { name: 'Bitcoin', value: '15000.16' },
  { name: 'Ethereum', value: '1000.12' },
  { name: 'Ripple', value: '2.1' }
];

console.log(myArray3);
myArray3.sort((a, b) => { return parseFloat(a.value) - parseFloat(b.value); });
console.log(myArray3);
console.log('------------------------------------');


console.log(myArray3.slice(0, 2));
console.log('------------------------------------');
