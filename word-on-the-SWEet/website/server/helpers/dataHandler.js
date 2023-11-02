//Preprocesses data, exposes methods

//import { Console } from 'console';
//import { start } from 'repl';

const fs = require('fs');

function DataHandler() {
    this.numStarterWords
    this.starterWords
    this.vocab = new Set()
}


//should be called once on startup
DataHandler.prototype.preprocess = function(filePath) {

    //let totalWords = 0;
    // Adding each word to the Set
    const allFileContents = fs.readFileSync(filePath, 'utf-8'); //const allFileContents = fs.readFileSync('broadband.sql', 'utf-8');
    allFileContents.split(/\r?\n/).forEach(line =>  {
        this.vocab.add(line.toString('ascii').trim())
        //totalWords++;
    });

    // Making Map of starter word frequencies
    const subwordFrequencies = new Map();
    for (const word of this.vocab) {
        for (var index = 0; index <= word.length-3; index++) {
            var subword = word.substring(index,index+3);
            if (subwordFrequencies.has(subword)) {
                subwordFrequencies.set(subword, subwordFrequencies.get(subword)+1);
            } else {
                subwordFrequencies.set(subword, 1);
            }
        }
    }
    
    //Making list of starter words, sorted by their frequency, in decreasing order
    //Idea is that more frequent starter words are easier for players.
    this.starterWords = Array.from(subwordFrequencies.entries())
    this.starterWords.sort((a,b) => b[1]-a[1]); //This is descending
    this.starterWords = this.starterWords.map(x => x[0]);

    this.numStarterWords = this.starterWords.length;
    //Console.log("Preprocessing finished.");
    
}

DataHandler.prototype.getStarterWord = function(difficulty) {
    //value between 0 and numStarterWords/3
    var index

    if ("easy" === difficulty) {
        index = Math.floor(Math.random()*(this.numStarterWords/6));
        let word = this.starterWords[index];

        return word;
    } else if ("medium" === difficulty) {
        index = Math.floor(Math.random()*(this.numStarterWords/3));
        let word = this.starterWords[index + Math.floor(this.numStarterWords / 6)];

        return word;
    } else if ("hard" == difficulty) {
        index = Math.floor(Math.random()*(this.numStarterWords/3));
        let word = this.starterWords[index + Math.floor(this.numStarterWords / 2)];

        return word;
    } else {
        throw new Error("Illegal difficulty argument");
    }
}

DataHandler.prototype.isValid = function(inputWord, currStarterWord) {
    return (this.vocab.has(inputWord) && inputWord.includes(currStarterWord));
}

module.exports = {
    DataHandler
}
