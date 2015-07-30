import esprima from 'esprima';

export default node => esprima.syntax.hasOwnProperty(node.type);
