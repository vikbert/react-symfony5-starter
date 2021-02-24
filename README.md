# React Symfony5 Starter
| stacks           | description                                  |
|------------------|----------------------------------------------|
| symfony5         | symfony 5 latest                             |
| react.js         | react.js framework                           |
| react.js         | react.js framework                           |
| TypeScript       | TypeScript for react.js                      |
| Jest             | Jest test runner                             |
| enzyme           | the Test framework                           |
| sass             | support sass for stylesheet                  |
| webpack notifier | Notifier for the package building in browser |

## Usage

Create local repository and clone the code:

```sh
$ git clone https://github.com/vikbert/react-symfony5-starter.git
```

Install dependencies:

```sh
$ composer install
$ npm install
```

Run the app:

```sh
$ symfony server:start
$ npm run watch
```

Navigating to https://localhost:{port} you should see the app main page.


This simple project starter shows how to wire up Symfony 5 with React and how to test the front part of the app with Jest & Enzyme.

<div align="center">
  <h1>React Symfony5 Starter</h1>
</div>


## Stack: step by step by yourself
Backend of the starter is based on Symfony 5 and uses Webpack Encore shipped with the framework to integrate frontend libraries and styles.

```sh
$ symfony new react-symfony5-starter
```
### Backend dependencies
Installation of additional dependencies was required in order to embed js part of the tool inside regular Symfony/Twig template:

```
$ composer require annotations twig asset
$ composer require symfony/webpack-encore-bundle
```

### Installation of Frontend libraries

```sh
$ npm install react react-dom prop-types react-router-dom
$ npm install @babel/preset-react --save-dev
$ npm install @babel/preset-typescript --save-dev
$ npm install @babel/plugin-syntax-jsx --save-dev
$ npm install typescript ts-loader --save-dev
$ npm install sass-loader@^8.0.0 node-sass --save-dev
```

Typescript params were placed inside `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "moduleResolution": "node",
    "jsx": "react",
    "esModuleInterop": true,
    "removeComments": true,
    "declaration": false,
    "sourceMap": true,
    "strict": true,
    "suppressImplicitAnyIndexErrors": true,
    "allowSyntheticDefaultImports": true,
    //Removes IDE TS errors while importing modules
    "noImplicitAny": false
  },
  "compileOnSave": true,
  "exclude": [
    "node_modules"
  ]
}
```

### Wiring React & Symfony
```text
app/
├─ templates/
│ ├─ default/
│ │    └─ index.html.twig
│ └─ base.html.twig

```

```html
{# base.html.twig #}
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{% block title %}{% endblock %}</title>
    {% block stylesheets %}
        {{ encore_entry_link_tags('app') }}
    {% endblock %}
</head>
<body>
    {% block body %}{% endblock %}
    {% block javascripts %}
        {{ encore_entry_script_tags('app') }}
    {% endblock %}
</body>
</html>
```
    
```html
{# index.html.twig #}
{% extends 'base.html.twig' %}
{% block title %} Symfony React Jest Enzyme {% endblock %}
{% block body %}
    <div id="root"></div>
{% endblock %}
```

### Overriding default Encore configuration

Webpack Encore fills in `webpack.config.js` file with initial instructions to configure the asset system.
We need to modify the file slightly, cause Jest & Enzyme require instructions from `babel.config.js` to load js modules.
To do so, remove or just comment the lines below:

Webpack Encore amendment inside `webpack.config.js`
```diff
 {
    enables @babel/preset-env polyfills
-  .configureBabelPresetEnv((config) => {
-       config.useBuiltIns = 'usage';
-       config.corejs = 3;
-    })
 }
```

External Babel configuration with `babel.config.js`

```js
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                    browsers: [
                        "> 0.5%",
                        "last 2 versions",
                        "IE 11"
                    ]
                },
                useBuiltIns: 'usage',
                corejs : {
                    version: "3",
                    proposals : true
                }
            },
        ],
        ['@babel/preset-react'],
        ['@babel/preset-typescript']
    ],
    plugins: ["@babel/plugin-syntax-jsx"]
};
```

### Jest & Enzyme integration

```sh
$ npm install jest enzyme enzyme-adapter-react-16 --save-dev
```

Jest configuration was defined inside `jest.config.js` and points to a test `setup.js` setup file:

```text
app/
├─ assets/
│ ├─ js/
│ ├─ ...
│ ├─ tests/
│     └─ setup.js
├─ jest.config.js
├─ ...
```

```js
//jest.config.js

module.exports = {
    rootDir: './assets',
    testRegex: './assets/js/.*test\\.tsx',
    setupFiles: ['<rootDir>/tests/setup.js'],
    //Generate coverage reports as HTML
    //inside /assets/coverage directory
    //"coverageReporters": ["json", "html"],
    collectCoverageFrom: [
        "<rootDir>/js/**/*.{js,jsx,ts,tsx}"
    ],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90
        },
    }
};
```

```js
//setup.js

import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
```
## Directory aliases

Adding aliases will help you to navigate between nested directories/components inside the project:

```diff
+ import App from '@components/App';
- //import App from './../../App';
```

- jest.config.js - define aliases for tests
- webpack.config.js - ships aliases for development
- tsconfig.js - ships aliases for IDE (removes unwanted errors while importing modules using aliases)

```diff
//jest.config.js

module.exports = {
    rootDir: './assets',
    testRegex: './assets/js/.*test\\.tsx',
    setupFiles: ['<rootDir>/tests/setup.js'],
+   moduleNameMapper: {
+       '^@containers(.*)$': '<rootDir>/js/containers/$1',
+       '^@components(.*)$': '<rootDir>/js/components$1',
+       '^@styles(.*)$': '<rootDir>/styles'
+   },
    collectCoverageFrom: [
        "<rootDir>/js/**/*.{js,jsx,ts,tsx}"
    ],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90
        },
    }
};
```

```diff
//webpack.config.js

...
Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or sub-directory deploy
    //.setManifestKeyPrefix('build/')
    .enableTypeScriptLoader()

+   .addAliases({
+       '@containers': path.resolve(__dirname, './assets/js/containers'),
+       '@components': path.resolve(__dirname, './assets/js/components'),
+       '@styles': path.resolve(__dirname, './assets/styles')
+   })
...
```    
    
```diff
//tsconfig.js

{
  "compilerOptions": {
    //Removes IDE TS errors while importing modules
    "noImplicitAny": false,
+    "baseUrl": "./assets",
+    "paths": {
+      "@styles/*": ["js/styles/*"],
+      "@containers/*": ["js/containers/*"],
+      "@components/*": ["js/components/*"]
+    }
  },
...
}
```

## Final directory structure

```text
app/
├─ assets/
│ ├─ js/
│ ├─ components/
│ ├─ ...
│ ├─ styles/
│ ├─ tests/
│ │   └─ setup.js
│ └─ app.tsx
│
├─ ... default Symfony directories
│
├─ templates/
│ ├─ default/
│ │   └─ index.html.twig
│ └─ base.html.twig
│ 
├─ .env
├─ package.json
├─ tsconfig.json
├─ babel.config.js
├─ jest.config.js
├─ webpack.config.js
│
└─ ... other files
```
## Tests
Project have two test files `Home.test.tsx` and `App.test.tsx` to run Jest out of the box:

```text
app/
├─ assets/
│ ├─ js/
│ ├─ components/
│ ├─  ├─ Home/
│ ├─  ├─  ├─ Home.test.tsx
│ ├─  ├─  ├─ Home.tsx
│ ├─  ├─  └─ index.tsx
│ ├─  ├─ App.test.tsx
│ ├─  └─ App.tsx
...
```

```sh
$ npm run test
```
![Jest test](jest-test.png)

```sh
$ npm run test --coverage
```
![Jest test coverage](jest-test-coverage.png)

