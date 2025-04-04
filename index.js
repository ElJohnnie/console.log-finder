#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ignoredDirs = ['node_modules', 'dist', 'build', '.next', 'out'];
let hadError = false;

const args = process.argv.slice(2);
const allowConsole = args.includes('--allow-console');

const targetDirArg = args.find(arg => !arg.startsWith('--'));
const projectDir = targetDirArg ? path.resolve(targetDirArg) : path.resolve(process.cwd());

function isIgnoredDir(dirName) {
  return ignoredDirs.includes(dirName);
}

function findConsoleLogs(dir) {
  let filesWithLogs = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

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
          hadError = true;
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
    hadError = true;
  }

  return filesWithLogs;
}

console.log(`📁 Scanning for console.log in: ${projectDir}`);

if (!fs.existsSync(projectDir)) {
  console.error('❌ Project directory not found!');
  process.exit(1);
}

const result = findConsoleLogs(projectDir);

if (hadError) {
  console.error('\n❌ Script failed due to read errors.');
  process.exit(1);
}

if (result.length) {
  console.log('\n⚠️  Found console.log in the following files:');
  result.forEach(file => console.log(' -', file));

  if (!allowConsole) {
    console.error('\n❌ Found console.log statements. Please remove them.');
    process.exit(1);
  } else {
    console.log('\nℹ️  console.log is allowed via --allow-console flag.');
  }
} else {
  console.log('✅ No console.log statements found.');
}
