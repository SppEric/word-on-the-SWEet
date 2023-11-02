//To run tests, run "npm test" in wobsite directory
 import {
    DataHandler
  } from '../server/helpers/dataHandler.js';

test('is 1 + 1 = 2?', function () {
    expect(1 + 1).toBe(2);
});

let dataHandler;
beforeAll(() => {
    dataHandler = new DataHandler();
    dataHandler.preprocess('./server/data/testDict.txt') 
    return dataHandler;
  });

test('test preprocess', () => {
    let vocab = dataHandler.vocab;

    //Verifying words are read correctly from file
    expect(vocab.size).toBe(4)
    expect(vocab.has("apple")).toBeTruthy()
    expect(vocab.has("app")).toBeTruthy()
    expect(vocab.has("pleasant")).toBeTruthy()
    expect(vocab.has("appliance")).toBeTruthy()

    //Verify number of starter words
    expect(dataHandler.numStarterWords).toBe(13)
    expect(dataHandler.starterWords.length).toBe(13)

    //Verify starter words are ordered by descending frequency
    expect(dataHandler.starterWords.toString()).toBe("app,ppl,ple,lea,eas,asa,san,ant,pli,lia,ian,anc,nce")
    expect(dataHandler.starterWords[0]).toBe("app")

});

test('test getStarterWord', async () => {
    expect(dataHandler.starterWords.includes(dataHandler.getStarterWord("easy"))).toBeTruthy()
    expect(dataHandler.starterWords.includes(dataHandler.getStarterWord("medium"))).toBeTruthy()
    expect(dataHandler.starterWords.includes(dataHandler.getStarterWord("hard"))).toBeTruthy()
    expect(() => dataHandler.getStarterWord("notARealDifficulty")).toThrow(Error("Illegal difficulty argument"))

});

test('test isValid', () => {
    expect(dataHandler.isValid("appliance","nce")).toBeTruthy()
    expect(dataHandler.isValid("leasure","lea")).toBeFalsy()
    expect(dataHandler.isValid("Pleasant","anc")).toBeFalsy()
});