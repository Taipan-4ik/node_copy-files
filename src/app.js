/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

function copying(src, dest) {
  if (args.length !== 2 || !src || !dest) {
    console.error(new Error('Two valid arguments must be entered'));
    process.exit(1);
  }

  if (args.some((a) => a.startsWith('-'))) {
    console.error(new Error('Invalid arguments: flags are not allowed'));
    process.exit(1);
  }

  let copyPath, pastePath;

  try {
    copyPath = fs.realpathSync(path.resolve(src));

    const copyStats = fs.statSync(copyPath);

    if (!copyStats.isFile()) {
      console.error(new Error('Only regular files are supported.'));
      process.exit(1);
    }

    try {
      pastePath = fs.realpathSync(path.resolve(dest));
    } catch {
      pastePath = path.resolve(dest);
    }

    if (copyPath === pastePath) {
      return;
    }

    const destStats = fs.statSync(pastePath, { throwIfNoEntry: false });

    if (destStats && destStats.isDirectory()) {
      console.error(new Error('Destination exists and is a directory.'));
      process.exit(1);
    }

    const parentDir = path.dirname(pastePath);
    const parentStats = fs.statSync(parentDir, { throwIfNoEntry: false });

    if (!parentStats) {
      console.error(new Error('Parent directory does not exist: ' + parentDir));
      process.exit(1);
    }

    fs.copyFileSync(copyPath, pastePath);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

copying(args[0], args[1]);
