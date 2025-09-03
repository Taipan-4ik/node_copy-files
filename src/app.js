/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

function copying(locationForCopy, locationForPaste) {
  if (args.length !== 2 || !locationForCopy || !locationForPaste) {
    console.error('Two valid arguments must be entered');

    return;
  }

  if (args.some((a) => a.startsWith('-'))) {
    console.error('Invalid arguments: flags are not allowed');

    return;
  }

  let copyPath, pastePath, copyStats;

  try {
    copyPath = fs.realpathSync(path.resolve(locationForCopy));
    pastePath = path.resolve(locationForPaste);
    copyStats = fs.statSync(copyPath);

    if (!copyStats.isFile()) {
      console.error('Only regular files are supported.');

      return;
    }

    // Проверка назначения
    const destStats = fs.statSync(pastePath, { throwIfNoEntry: false });

    if (destStats && destStats.isDirectory()) {
      console.error('Destination exists and is a directory.');

      return;
    }

    const parentDir = path.dirname(pastePath);
    const parentStats = fs.statSync(parentDir, { throwIfNoEntry: false });

    if (!parentStats) {
      console.error('Parent directory does not exist:', parentDir);

      return;
    }
  } catch (err) {
    console.error('Error:', err.message);

    return;
  }

  if (copyPath === pastePath) {
    console.error('Source and destination paths are the same');

    return;
  }

  fs.cp(copyPath, pastePath, (err) => {
    if (err) {
      console.error('Something went wrong!', err);
    } else {
      console.log('Copy successful!');
    }
  });
}

copying(args[0], args[1]);
