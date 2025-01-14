import path from 'path';

const modes = ['development', 'production'];

const envArg = process.argv.find((arg) => arg.startsWith('NODE_ENV='));
if (!envArg || !modes.includes(envArg.split('=')[1]))
  throw new Error('Invalid NODE_ENV value');

const NODE_ENV = envArg.split('=')[1];

const [servePath, indexPath] = (() => {
  if (NODE_ENV !== 'production')
    return ['', ''];

  const servePath = path.join(import.meta.dirname, '../../frontend/dist');
  const indexPath = path.join(servePath, 'index.html');
  return [servePath, indexPath];
})();

export { servePath, indexPath, NODE_ENV };
