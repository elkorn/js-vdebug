import fs from 'fs';

export
default
function data(path) {
  return fs.readFileSync(`${__dirname}/data/${path}.js`);
}
