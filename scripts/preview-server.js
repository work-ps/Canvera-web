import { preview } from 'vite';

const server = await preview({
  configFile: './vite.config.js',
});

server.printUrls();
