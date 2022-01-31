const JustifyText = (text, maxWidth, remainingWords) =>{
    if(text.length == 0) return {justifiedText: text, numberOfWords: 0}
    result = []
    let count_words = 0
    paragraphs = text.split('\n')
    for(const paragraph of paragraphs){
        const words = paragraph.match(/("[^"]+"|[^"\s]+)/g);
        // line is empty
        if(!words)continue
        count_words += words.length
        if(remainingWords < count_words) {
            return { justifiedText: null, numberOfWords: 0 }
        }
        const allLines = [[]];
        allLines[0].nbLetters = 0;
        for (const word of words) {
            let row = allLines[allLines.length - 1];
            if (row.length && row.nbLetters + row.length + word.length > maxWidth) {
                allLines.push([]);
                row = allLines[allLines.length - 1];
                row.nbLetters = 0;
            }
            row.push(word);
            row.nbLetters += word.length;
        }
        for (let lineIndex = 0; lineIndex < allLines.length; lineIndex++) {
            const row = allLines[lineIndex];
            if (row.length === 1 || lineIndex === allLines.length - 1) {
                allLines[lineIndex] = row.join(' ') + ' '.repeat(maxWidth - row.nbLetters - row.length + 1);
                continue;
            }
            let line = row[0];
            const spaces = maxWidth - row.nbLetters;
            const minSpaces = ' '.repeat(Math.floor(spaces / (row.length - 1)));
            const remainingSpace = spaces % (row.length - 1);
            for (let wordIndex = 1; wordIndex < row.length; wordIndex++) {
                line += minSpaces + (wordIndex <= remainingSpace ? ' ' : '') + row[wordIndex];
            }
        allLines[lineIndex] = line;
        }
        result.push(allLines.join('\n'))
    }
    return {justifiedText: result.join('\n'), numberOfWords: count_words};
};

module.exports = { JustifyText }