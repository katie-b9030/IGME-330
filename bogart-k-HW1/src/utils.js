/**
 * returns a random word from the provided array
 * 
 * @param {Array} array - assortment of random words
 * @returns random word
 */
export const getRandomWord = (array) => { return array[Math.floor(Math.random() * array.length)]; }