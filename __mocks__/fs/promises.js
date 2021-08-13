/* eslint-disable */

const path = require('path');
const fs = jest.createMockFromModule('fs');

let mockFiles = Object.create(null);

function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);

  for (const file of newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }
}

function readdir(directoryPath) {
  return Promise.resolve(mockFiles[directoryPath] || []);
}

function stat(path) {
  return Promise.resolve({ isDirectory: () => !!path.match(/dir/) });
}

fs.__setMockFiles = __setMockFiles;
fs.readdir = readdir;
fs.stat = stat;

module.exports = fs;
