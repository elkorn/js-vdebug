export default class Loc {
  constructor(startColumn, startLine, endColumn, endLine) {
    return {
      start: {
        column: startColumn,
        line: startLine
      },
      end: {
        column: endColumn,
        line: endLine
      }
    };
  }
};
