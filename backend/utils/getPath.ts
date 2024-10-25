import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getPathFromBackend(pathFromBackend: string) {
  let dirPath = __dirname;
  while (path.basename(dirPath) !== 'backend') {
    dirPath = path.resolve(dirPath, '..');
  }
  return path.join(dirPath, pathFromBackend);
}

export default getPathFromBackend;
//# sourceMappingURL=getPath.js.map
