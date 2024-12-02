export function getEnvPath() {
  switch (process.env.NODE_ENV) {
    case 'test':
      return '.env.test.local';

    default:
      return '.env';
  }
}
