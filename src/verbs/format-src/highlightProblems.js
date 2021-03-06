import _ from 'lodash';

import {
  wrap,
  substring,
  columnize,
  inHtml
}
from './utils';

const segmentize = segments => (line, index) => {
  if (segments[index + 1]) {
    let currentIndex = 0;
    let result = segments[index + 1].reduce((result, segment) => {
      if (currentIndex < segment[0]) {
        result.push(wrap('span')(line.substring(currentIndex, segment[0])));
      }

      currentIndex = segment[1];
      result.push(wrap('u')(substring(line, ...segment)));
      return result;
    }, []);

    result.push(wrap('span')(line.substring(currentIndex)));
    return result.join('');
  }

  return wrap('span')(line);
};

export
default (src, scopes) => {
  const lines = src.split('\n');
  const problematicSegments = {};

  scopes.forEach(scope => {
    scope.references.forEach(reference => {
      if (reference.isProblematic()) {
        let line = reference.loc.start.line;

        if (!problematicSegments[line]) {
          problematicSegments[line] = [];
        }

        problematicSegments[line].push([reference.loc.start.column, reference.loc.end.column]);
      }
    });
  });

  return inHtml(lines.map(_.compose(wrap('div'), segmentize(problematicSegments))).join('\n'));
};
