# Performance-oriented webpack boilerplate

## Config

Modify the `tasks/config.json` file by adjusting the `publicStaticPath` to match the absolute URL for the JS [dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports) to function correctly (i.e. '/wp-content/themes/theme-slug/dist').

Add more JS entries to both `modernJsEntries` and `legacyJsEntries` as necessary. Recommend keeping imported components in subfolders.

## Usage

Build all the source files, watches for changes:
```sh
npm start
```

Build minified, production-ready source files without watching for changes:
```sh
npm run build
```

Lint files:
```sh
npm run lint
```

Automatically fix cosmetic lint errors:
```sh
npm run lint-fix
```

## JavaScript

The webpack implements several advanced webpack features::
* [Code splitting](https://webpack.js.org/guides/code-splitting/)
* [Dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports)
* Generates both ES2015+ & ES5 legacy JS bundles (module/nomodule)

### Module/NoModule

The ES2015+ scripts should be loaded using `type=module`, which runs as a deferred script. Browsers supporting it also have [native support](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/) for `async/await`, `Classes`, `arrow functions`, `fetch`, `Promises`, `Map` and `Set`, and therefore there's no polyfill cost associated with using them.

```html
<script type="module" src="/dist/js/main.js"></script>
```

For legacy browsers load the ES5 scripts are loaded as a fallback with the `nomodule` attribute. Maintain the `defer` attribute for parity with modern browsers. The polyfills for the abovely referenced modern elements are loaded in the legacy JS file via babel, while the `fetch` polyfill is imported.

```html
<script nomodule defer src="/dist/js/main-legacy.js"></script>
```

###

### Idle Until Urgent

The [idlize](https://www.npmjs.com/package/idlize) library is leveraged to queue non-urgent tasks during idle periods with a timeout fallback.

Of particular interest is also the approach of loading of on demand Javascript via [IdleQueue with dynamic imports](https://parallax-developer-docs.netlify.app/guides/idle-until-urgent/#idlequeue) for non critical functionality.
