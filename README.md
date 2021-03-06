
<p align="center"><h1 align="center">
  TypeORM File Parser
</h1>

<p align="center">
  A delicious TypeScript/TypeORM file parser (for the extraction of decorators and properties of an entity)
</p>

<p align="center">
    <a href="https://github.com/MyUnisoft/typeorm-file-parser"><img src="https://img.shields.io/github/package-json/v/MyUnisoft/typeorm-file-parser?style=flat-square" alt="npm version"></a>
    <a href="https://github.com/MyUnisoft/typeorm-file-parser"><img src="https://img.shields.io/github/license/MyUnisoft/typeorm-file-parser?style=flat-square" alt="license"></a>
    <a href="https://github.com/MyUnisoft/typeorm-file-parser"><img src="https://img.shields.io/github/languages/code-size/MyUnisoft/typeorm-file-parser?style=flat-square" alt="size"></a>
    <a href="./SECURITY.md"><img src="https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg?style=flat-square" alt="Responsible Disclosure Policy" /></a>
</p>

## 📢 About
This package has been created to parse TypeORM file and return informations on a given Entity (decorators, columns and properties). The main idea is to be able to retrieve information for a CLI or documentation.

## 🚧 Requirements
- [Node.js](https://nodejs.org/en/) version 14 or higher

## 🚀 Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @myunisoft/typeorm-file-parser
# or
$ yarn add @myunisoft/typeorm-file-parser
```

## 📚 Usage example

```ts
import { fileURLToPath } from "url";
import path from "path";

import * as TypeORMFileParser from "@myunisoft/typeorm-file-parser";

// CONSTANTS
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const result = await TypeORMFileParser.readFile(
  path.join(__dirname, "EntityFile.ts")
);
console.log(result);
```

It will return an Object like the following one
```js
{
  "properties": {
    "id": {
      "type": "number",
      "decorators": {
        "PrimaryGeneratedColumn": {
          "name": "PrimaryGeneratedColumn"
        }
      }
    },
    "note": {
      "type": "string",
      "decorators": {
        "Column": {
          "name": "Column",
          "type": "text",
          "properties": {
            "nullable": true
          }
        }
      }
    },
    "billed": {
      "type": "boolean",
      "decorators": {
        "Column": {
          "name": "Column",
          "type": "boolean",
          "properties": {
            "default": "false"
          }
        }
      }
    }
  },
  "unique": {
    "constraintName": "GiArticle_reference",
    "columns": [
      "reference"
    ]
  }
}
```

## 📜 API

The response of the readFile method is described by the following interfaces:

```ts
export interface TypeORMProperty {
  /** TypeScript/JavaScript type */
  type: string;

  /** TypeScript (TypeORM) decorators attached to the property */
  decorators: Record<string, TypeORMDecoratorBase>;
}

export interface ParsedTypeORMResult {
  /** Entity Unique decorator (without root name property) */
  unique?: DecoratorExWithoutName;

  /** Entity properties as a plainObject */
  properties: Record<string, TypeORMProperty>;
}
```

`TypeORMDecoratorBase` is a composition of multiple types

```ts
export type TypeORMDecoratorExtended =
  UniqueDecorator |
  RelationDecorator |
  ColumnDecorator |
  JoinDecorator;

export type TypeORMDecoratorBase =
  { name: "Entity" | "PrimaryGeneratedColumn" } |
  TypeORMDecoratorExtended;
```

Each of them can be found in `./src/decorator/parsers`

<details>
<summary>UniqueDecorator</summary>

```ts
export interface UniqueDecorator {
  name: "Unique";
  constraintName: string | null;
  columns: string[];
}
```

</details>

<details>
<summary>RelationDecorator</summary>

```ts
export interface RelationDecorator {
  name: RelationKind;
  table: string;
  tableColumn: string;
  properties: Properties;
}
```

</details>

<details>
<summary>ColumnDecorator</summary>

```ts
export type ColumnKind = "PrimaryColumn" | "Column" | "Generated";

export interface ColumnDecorator {
  name: ColumnKind;
  type: string;
  properties: Properties;
}
```

</details>

<details>
<summary>JoinDecorator</summary>

```ts
export type JoinKind = "JoinTable" | "JoinColumn";

export interface JoinDecorator {
  name: JoinKind;
  properties: Properties;
}
```

</details>
