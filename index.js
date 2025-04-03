#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function exists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    console.error(`Error checking existence of ${filePath}:`, err);
    return false;
  }
}

function findConsoleLogs(dir) {
  let filesWithLogs = [];
  const ignoredDirs = ['node_modules', 'dist', 'build', '.next', 'out'];

  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);

      if (ignoredDirs.some(ignoredDir => fullPath.includes(ignoredDir))) {
        continue;
      }

      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        filesWithLogs = filesWithLogs.concat(findConsoleLogs(fullPath));
      } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.ts'))) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.includes('console.log')) {
          filesWithLogs.push(fullPath);
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err);
  }

  return filesWithLogs;
}

const projectDir = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(process.cwd());

if (exists(projectDir)) {
  console.log(`Scanning for console.log in: ${projectDir}`);
  const files = findConsoleLogs(projectDir);

  if (files.length > 0) {
    console.log('Found console.log statements in the following files:');
    files.forEach(file => console.log(`- ${file}`));
  } else {
    console.log('No console.log statements found in the project.');
  }
} else {
  console.error('Project directory not found!');
}