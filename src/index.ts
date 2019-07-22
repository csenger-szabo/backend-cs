import { startApp } from './app';

const thrower = (err: unknown) => {
  throw err;
};
const throwToGlobal = (err: unknown) => setTimeout(thrower(err), 0);

process.on('unhandledRejection', throwToGlobal);

startApp().catch(throwToGlobal);
