/* eslint-disable no-console */
'use strict';

const fs = require('fs');

const args = process.argv.slice(2);

function copying(locationForCopy, locationForPaste) {
  if (locationForCopy === locationForPaste) {
    return;
  }

  if (!locationForCopy || !locationForPaste) {
    console.error('Not enough arguments provided');

    return;
  }

  fs.cp(locationForCopy, locationForPaste, (err) => {
    if (err) {
      console.error('Something went wrong!');
    }
  });
}

copying(args[0], args[1]);
