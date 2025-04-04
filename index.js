#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ignoredDirs = ['node_modules', 'dist', 'build', '.next', 'out'];

function isIgnoredDir(dirName) {
  return ignoredDirs.includes(dirName);
}

function findConsoleLogs(dir) {
  let filesWithLogs = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      console.log(`🔍 Scanning: ${fullPath}`);

      if (entry.isDirectory()) {
        if (isIgnoredDir(entry.name)) continue;
        filesWithLogs = filesWithLogs.concat(findConsoleLogs(fullPath));
      } else if (entry.isFile() && /\.(js|ts|jsx|tsx)$/.test(entry.name)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          if (content.includes('console.log')) {
            filesWithLogs.push(fullPath);
          }
        } catch (err) {
          console.error(`Error reading file ${fullPath}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
  }

  return filesWithLogs;
}

const projectDir = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(process.cwd());

console.log(`📁 Scanning for console.log in: ${projectDir}`);

if (!fs.existsSync(projectDir)) {
  console.error('❌ Project directory not found!');
  process.exit(1);
}

const result = findConsoleLogs(projectDir);

if (result.length) {
  console.log('\n⚠️  Found console.log in the following files:');
  result.forEach(file => console.log(' -', file));
} else {
  console.log('✅ No console.log statements found.');
}
