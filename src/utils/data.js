import mkdirp from 'mkdirp';
import fs from 'fs';
import path from 'path';

const dataPath = (...subPathSegments) => path.join(__dirname, '..', '..', 'data', ...subPathSegments);
const filePath = dirPath => filename => path.join(dataPath(dirPath), filename);

const data = { from : filePath('in'),
               to: filePath('out')
             };

// Create the data directory if needed.
mkdirp.sync(dataPath('in'));
mkdirp.sync(dataPath('out'));

export

function write(filename, contents, done) {
  const path = data.to(filename);
  fs.writeFile(path, contents, err => {
    done(err, path);
  });
}

export

function read(filename, done) {
  const path = data.from(filename);
  fs.readFile(path, 'utf-8', (err, data) => {
    done(err, data, path);
  });
}
