<p align="center">
  <a href="https://npmjs.com/package/vite-fait"><img src="https://img.shields.io/npm/v/vite-fait.svg" alt="npm package"></a>
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatibility"></a>
  <a href="https://app.travis-ci.com/github/bechir/vite-fait"><img src="https://app.travis-ci.com/bechir/vite-fait.svg?branch=main" alt="tests"></a>
</p>
<br/>

# Vite ⚡ Fait
> Easily Integrate Vite Into Your Backend Application

# Installation 

```sh
# using npm
npm install vite-fait --save-dev
# using yarn
yarn add --dev vite-fait
```

# Usage
[Read the Vite docs here.][Vite Docs]

> Using Symfony? [See the docs](https://github.com/bechir/vite-bundle/blob/main/README.md)

Create `vite.config.js` in the root folder:

```
project
│   package.json
│
└───assets
│   │   app.js
│   │   app.scss
│   │
│   └───public
│       │   favicon.ico
│       │   logo.png
│       │   ...
│   
└───src
    │   index.php
    │   ...
    vite.config.js
```

Add the following code in `vite.config.js`:

```javascript
const ViteFait = require('vite-fait');

ViteFait
  .setBase('/dist/')

  .setRoot('assets')

  // Directory where compiled assets will be stored.
  // Relative from root dir.
  .setOutputPath('../public/dist')

  // Splits your files into smaller pieces for greater optimization.
  .splitEntryChunks()

  // Set to false to disable minification, or specify the minifier to use (esbuild or terser)
  .minify(ViteFait.isProduction())

  // enables hashed filenames (e.g. app.abc123.css)
  .enableVersioning(ViteFait.isProduction())

  // Dev server options
  .setServerOptions({
  //   port: 3001
  //   https: true,
  //   port: 3001
  })

  /*
  * Entry files config
  *
  * Each entry will result in one JavaScript file (e.g. app.js)
  * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
  */
  .addEntry('app', './assets/app.js')
  .addEntry('admin', './assets/admin/app.js');

module.exports = ViteFait.getViteConfig()

```
Add vite-fait scripts in your `package.json`
```json
{
  "scripts": {
    "build": "vite-fait build",
    "dev": "vite-fait dev",
  }
}
```

Then run your first build with `yarn build` or `npm run build`
It generate `entrypoints.json` file in `public/dist`:
```json
{
  "entrypoints": {
    "app": {
      "js": [
        "/dist/app.7f38ab96.js"
      ],
      "css": [
        "/dist/app.c385b6b3.css"
      ]
    },
    "admin": {
      "js": [
        "/dist/admin.a88436ae.js"
      ],
      "css": [
        "/dist/admin.0e68df5b.css"
      ]
    }
  }
}
```

## Using Plugins
> Read [how to use vite plugins](https://vitejs.dev/guide/using-plugins.html) first before reading this section

Put your plugins inside the `usePlugins` method:
```js

const fooPlugin = function() {
  return {
    name: 'vite-plugin-foo',
    configureServer() {
      console.log('foo');
    }
  }
}

ViteFait
  .usePlugins(fooPlugin()) // use array for multiple plugins: [fooPlugin(), barPlugin()]
```

## Multiple builds
TODO

## TODO
- [ ] Add more tests
- [ ] React support
- [ ] Vue support
- [ ] Documentation

[Vite docs]: https://vitejs.dev
