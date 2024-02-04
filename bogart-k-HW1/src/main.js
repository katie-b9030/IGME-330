import { getRandomWord } from "./utils.js";

let words1, words2, words3;
let word1, word2, word3, babble;

/**
 * parses values from a json file
 * 
 * @param {function} callback - parses json
 */
const loadBabble = (callback) => {
    const url = "data/babble-data.json"
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => {
        console.log(`In onload - HTTP Status Code = ${e.target.status}`);
        const string = e.target.responseText;
        callback(string);
    }
    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
    xhr.open("GET", url);
    xhr.send();
}

/**
 * creates randomly generated babble
 * 
 * @param {int} n - number of babbles to generate
 * @return {string} n lines of babble
 */
const createBabble = (num) => {
    document.querySelector("#output").innerHTML = "";
    for (let i = 0; i < num; i ++) {
        word1 = getRandomWord(words1);
        word2 = getRandomWord(words2);
        word3 = getRandomWord(words3);

        babble = `<p>${word1} ${word2} ${word3}</p>`;

        document.querySelector("#output").innerHTML += babble;
    }
}

/**
 * parses json, assigns arrays, initializes button calls, and creates starting babble
 * 
 * @param {string} text - json to be parsed
 */
const babbleLoaded = (text) => {
    try{
        const json = JSON.parse(text);
    }
    catch{
        console.log("Something went wrong!");
        return;
    }

    words1 = json["words1"];
    words2 = json["words2"];
    words3 = json["words3"];

    document.querySelector("#less-babble").onclick = () => createBabble(1);
    document.querySelector("#more-babble").onclick = () => createBabble(5);

    createBabble(1);
}

loadBabble(babbleLoaded);

