// handy helper functions!
/**
 * returns a random rgb color with an opacity of 80%
 */
export const getRandomColor = () => {
    function getByte() {
        return 55 + Math.round(Math.random() * 200);
    }
    return `rgba(${getByte()},${getByte()},${getByte()},.8)`;
}

/**
 * returns a random int between the given values
 */
 export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}