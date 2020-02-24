import lineReaderSync from "line-reader-sync";

export const compare = path => {
  const lineReader = new lineReaderSync(path);
  const separators = [",", ".", "!", "?", ":", ";"];
  const rawText = lineReader.toLines();
  let statistics = [];
  const removeSeparator = word => {
    let wordWithoutSeparator = word;
    separators.forEach(separator => {
      if (separator == word.charAt(word.length - 1))
        wordWithoutSeparator = word.slice(0, word.length - 1);
    });
    return wordWithoutSeparator;
  };
  const prepareText = () => {
    let text = [];
    for (let line of rawText) {
      const index = line.indexOf("\r");
      if (index !== -1) {
        text.push(line.slice(0, index));
      } else text.push(line);
    }
    const linesAsAString = text.join(" ");
    const wordsSeparated = linesAsAString.split(" ");

    wordsSeparated.forEach(word => {
      word = removeSeparator(word);
      word = word.toLowerCase();
    });
    return wordsSeparated;
  };

  const countWords = () => {
    const words = prepareText();
    words.forEach(word => {
      const index = isNewWord(word);
      if (index !== -1) statistics[index].amount++;
      else statistics.push({ word, amount: 1 });
    });
    statistics.sort((a, b) => b.amount - a.amount);
  };

  const isNewWord = word => {
    let statIndex = -1;
    if (statistics.length != 0)
      statistics.forEach((statistic, index) => {
        if (statistic.word == word) statIndex = index;
      });
    return statIndex;
  };
  countWords();

  return statistics;
};
const info = compare("file.txt");
console.log(info);
export default compare;
