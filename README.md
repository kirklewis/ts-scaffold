# TS Scaffold

A starter TypeScript project to get up and running quickly. The [tsconfig.json](tsconfig.json) file can be further configured as desired. 

## Development

### Run Tests

Unit tests
```bash
npm run test-unit
```

Unit Tests with coverage report
```bash
npm run test-coverage
```

### Build

```bash
npm run build
```

### Importing Modules

New modules added to `lib/` can be exported from `index.ts` so all modules are listed in a single place. As a result of this:

- all tests can simply import any module from `index.ts`.

- once the project is built all modules will be available from `index.js`.

This approach is completely optional.

## License

[MIT](LICENSE)