import getReferenceHandlers from './getReferenceHandlers';
import traverse from './traverse';
import fs from 'fs';

traverse([
    getReferenceHandlers
], ({
    ast, result
}) => fs.writeFile('syntax.json', JSON.stringify(result, null, '  ')));
