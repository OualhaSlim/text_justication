// need to count words before processing
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
            return {justifiedText: null, numberOfWords: 0}
        }
        const res = [[]];
        res[0].letters = 0;
        for (const word of words) {
            let row = res[res.length - 1];
            if (row.length && row.letters + row.length + word.length > maxWidth) {
                res.push([]);
                row = res[res.length - 1];
                row.letters = 0;
            }
            row.push(word);
            row.letters += word.length;
        }
        for (let r = 0; r < res.length; r++) {
            const row = res[r];
            if (row.length === 1 || r === res.length - 1) {
                res[r] = row.join(' ') + ' '.repeat(maxWidth - row.letters - row.length + 1);
                continue;
            }
            let line = row[0];
            const spaces = maxWidth - row.letters;
            const minSpaces = ' '.repeat(Math.floor(spaces / (row.length - 1)));
            const addSpace = spaces % (row.length - 1);
            for (let w = 1; w < row.length; w++) {
                line += minSpaces + (w <= addSpace ? ' ' : '') + row[w];
            }
        res[r] = line;
        }
        result.push(res.join('\n'))
    }
    return {justifiedText: result.join('\n'), numberOfWords: count_words};
};

module.exports = { JustifyText }

// var fullJustify = function(words, maxWidth) {
//     const res = [[]];
//     res[0].letters = 0;
//     for (let word of words) {
//         let row = res[res.length - 1];
//         if (row.length && row.letters + row.length + word.length > maxWidth) {
//             res.push([]);
//             row = res[res.length - 1];
//             row.letters = 0;
//         }
//         row.push(word);
//         row.letters += word.length;
//     }
//     for (let r = 0; r < res.length; r++) {
//         let row = res[r];
//         if (row.length === 1 || r === res.length - 1) {
//             res[r] = row.join(' ') + ' '.repeat(maxWidth - row.letters - row.length + 1);
//             continue;
//         }
//         let line = row[0];
//         let spaces = maxWidth - row.letters;
//         let minSpaces = ' '.repeat(Math.floor(spaces / (row.length - 1)));
//         let addSpace = spaces % (row.length - 1);
//         for (let w = 1; w < row.length; w++) {
//             line += minSpaces + (w <= addSpace ? ' ' : '') + row[w];
//         }
//         res[r] = line;
//     }
//     return res;
// };