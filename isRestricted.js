import _ from 'lodash';

const RESTRICTED = ['abstract', 'arguments', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class*', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else', 'enum*', 'eval', 'export*', 'extends*', 'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import*', 'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super*', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'undefined', 'var', 'void', 'volatile', 'while', 'with', 'yield'];

export default _.partial(_.contains, RESTRICTED);
