# Console Log Finder

`console-log-finder` is an NPM library that scans a given directory (and its subdirectories) for JavaScript (`.js`) and TypeScript (`.ts`) files containing `console.log` statements. It helps developers identify and remove unnecessary `console.log` calls from their codebase.

## Features

- Recursively searches through directories.
- Ignores the `node_modules` folder.
- Detects `console.log` statements in `.js` and `.ts` files.
- Outputs a list of files containing `console.log`.

## Installation

You can install the library directly from NPM:

```bash
npm install console-log-finder --save-dev
```

make your local command

```bash

{
  "scripts": {
    "find-console": "find-console-log ."
  }
}

```

## Notes

- The script skips the `node_modules` folder to avoid unnecessary processing.
- It only scans files with `.js` and `.ts` extensions.

## License

This project is licensed under the MIT License.

## NPM Package

You can find the package on NPM: [console-log-finder](https://www.npmjs.com/package/console-log-finder)