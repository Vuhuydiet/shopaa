import { fileURLToPath } from 'url';
import path from 'path';

import __dirname from './dirname.cjs';

function getPathFromBackend(pathFromBackend) {
  let dirPath = __dirname;
  while (path.basename(dirPath) !== 'backend') {
    dirPath = path.resolve(dirPath, '..');
  }
  return path.join(dirPath, pathFromBackend);
}

export { getPathFromBackend };
