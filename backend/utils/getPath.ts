import path from 'path';

function getPathFromBackend(pathFromBackend: string) {
  let dirPath = import.meta.url;
  while (path.basename(dirPath) !== 'backend') {
    dirPath = path.resolve(dirPath, '..');
  }
  return path.join(dirPath, pathFromBackend);
}

export default getPathFromBackend;
//# sourceMappingURL=getPath.js.map
