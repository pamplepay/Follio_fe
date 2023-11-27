export class StringHandler {
  static replaceSpecialCharacters(text) {
    if (text && typeof text === 'string') {
      text = text.replace(/"/g, '\\"');
      text = text.replace(/`/g, '\`');
      text = text.replace(/\n/g, '\\n');
      text = text.replace(/\r/g, '\\r');
      text = text.replace(/\t/g, '\\t');
      text = text.replace(/\v/g, '\\v');
      text = text.replace(/\f/g, '\\f');
      text = text.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '');

      text = text.replace(/\\[^"`nrtvf]/g, (matchedString, matchedIndex, origine) => {
        const lastCharacter = matchedString.substring(1, matchedString.length);
        const result = `\\\\${lastCharacter}`;
        return result;
      });
    }

    return text;
  }
}
