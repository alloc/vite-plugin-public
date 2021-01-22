# vite-plugin-public

[![npm](https://img.shields.io/npm/v/vite-plugin-public.svg)](https://www.npmjs.com/package/vite-plugin-public)
[![Code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/alecdotbiz)

> Postprocessing for /public

&nbsp;

### Usage

The `publicHash` plugin helps you add content hashes to all or some files 
from the `/public` directory.

#### Options

- `ignore?: RegExp`  
  Matching files are not hashed.

- `skipRename?: boolean`  
  Rewrite URLs but skip renaming files in `outDir`.  
  Useful when your Vite config is loaded more than once.

```ts
import {publicHash} from 'vite-plugin-public'

export default {
  plugins: [
    publicHash({
      ignore: /^static\//,
    }),
  ]
}
```

Other plugins may be added in the future. Ideas and contributions welcome!
