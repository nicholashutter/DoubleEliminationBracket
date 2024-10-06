import fs from 'fs-extra';
import childProcess from 'child_process';

/**
 * Start
 */
(async () => {
  try {
    // Remove current build
    await remove('./dist/');
    // Copy front-end files
    await copy('./src/public', './dist/public');
    await copy('../reactclient/build/static', './dist/views');
    // Copy back-end files
    await exec('tsc --build tsconfig.prod.json', './');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();

/**
 * Remove file
 */
function remove(loc: string): Promise<void> {
  return new Promise((res, rej) => {
    return fs.remove(loc, (err) => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
}

/**
 * Copy file.
 */
function copy(src: string, dest: string): Promise<void> {
  return new Promise((res, rej) => {
    return fs.copy(src, dest, (err) => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
}

/**
 * Do command line command.
 */
function exec(cmd: string, loc: string): Promise<void> {
  return new Promise((res, rej) => {
    return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
      if (stdout) {
        console.log(stdout);
      }
      if (stderr) {
        console.warn(stderr);
      }
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
}


// D:\Development\Javascript\tourneyApp\expressServer\build.ts