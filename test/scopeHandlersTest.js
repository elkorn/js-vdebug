import * as helpers from './helpers';
import should from 'should';
import scopeHandlers from '../scopeHandlers';
import variableHandlers from '../variableHandlers';
import getReferenceHandlers from '../getReferenceHandlers';
import traverse from '../traverse';

const test = helpers.testHandlers();

describe('creating scopes', () => {
  it('works', test(`let x = 0;`, function({
    result, done
  }) {
    console.log(result);
    result.length.should.equal(1);
    done();
  }));
});
