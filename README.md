
<p align="center"><h1 align="center">
  TypeORM File Parser
</h1>

<p align="center">
  A TypeORM (typescript) file parser.
</p>

## 📢 About
This package has been created to parse TypeORM file and return informations on decorators and columns.

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
import * as TypeORMFileParser from "@myunisoft/typeorm-file-parser";

const result = await TypeORMFileParser.readFile("./myEntiyFile.ts");
console.log(result);
```

## 📜 API

The response of the readFile method is described by the following interfaces:

```ts
export interface TypeORMProperty {
  type: string;
  decorators: Record<string, TypeORMDecoratorBase>;
}

export interface ParsedTypeORMResult {
  unique?: DecoratorExWithoutName;
  properties: Record<string, TypeORMProperty>;
}
```

`TypeORMDecoratorBase` is a composition of multiple types

```ts
export type TypeORMDecoratorExtended = UniqueDecorator | RelationDecorator | ColumnDecorator | JoinDecorator;
export type TypeORMDecoratorBase = { name: "Entity" | "PrimaryGeneratedColumn" } | TypeORMDecoratorExtended;
```

Each of them can be found in `./src/decorator/parsers`
