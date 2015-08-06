import _ from 'lodash';

import {
  wrap,
  columnize,
  inHtml
} from './utils';

export default src => inHtml(src.split('\n').map(_.compose(wrap('div'), columnize)).join('\n'))
