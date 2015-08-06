import _ from 'lodash';

export const wrap = tag => content => `<${tag}>${content}</${tag}>`;
export const tabify = str => '\t' + str;
export const columnize = line => line.split('').map(wrap('span')).join('');
export const substring = _.curry((str, start, end) => str.substring(start, end));
export const inHtml = src => _.compose(wrap('html'), wrap('body'))(src).replace(/ /g, '&nbsp;');
