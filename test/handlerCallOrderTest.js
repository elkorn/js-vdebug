import * as helpers from './helpers';
import should from 'should';
import sinon from 'sinon';
import scopeHandlers from '../scopeHandlers';
import variableHandlers from '../variableHandlers';
import getReferenceHandlers from '../getReferenceHandlers';
import traverse from '../traverse';

const SRC = `   `;
const makeHandlers = () => [{
  enter: {
    always: sinon.spy()
  },
  leave: {
    always: sinon.spy()
  }
}, {
  enter: {
    always: sinon.spy()
  },
  leave: {
    always: sinon.spy()
  }
}];

describe('node handlers are called in correct order -', () => {
  it('enter handlers', helpers.testHandlers(...makeHandlers())(SRC, function({
    done, handlers
  }) {
    const [firstHandlers, secondHandlers] = handlers;

    sinon.assert.callOrder(
      firstHandlers.enter.always,
      secondHandlers.enter.always);

    done();
  }));

  it('leave handlers', helpers.testHandlers(...makeHandlers())(SRC, function({
    done, handlers
  }) {
    const [firstHandlers, secondHandlers] = handlers;
    sinon.assert.callOrder(
      secondHandlers.leave.always,
      firstHandlers.leave.always);
    done();
  }));
});
