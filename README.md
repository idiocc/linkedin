# @idio/linkedin

[![npm version](https://badge.fury.io/js/@idio/linkedin.svg)](https://npmjs.org/package/@idio/linkedin)

`@idio/linkedin` is The LinkedIn OAuth Login Routes For The Idio Web Server.

```sh
yarn add -E @idio/linkedin
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`linkedin(arg1: string, arg2?: boolean)`](#mynewpackagearg1-stringarg2-boolean-void)
  * [`Config`](#type-config)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import linkedin from '@idio/linkedin'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `linkedin(`<br/>&nbsp;&nbsp;`arg1: string,`<br/>&nbsp;&nbsp;`arg2?: boolean,`<br/>`): void`

Call this function to get the result you want.

__<a name="type-config">`Config`</a>__: Options for the program.

|   Name    |   Type    |    Description    | Default |
| --------- | --------- | ----------------- | ------- |
| shouldRun | _boolean_ | A boolean option. | `true`  |
| __text*__ | _string_  | A text to return. | -       |

```js
/* yarn example/ */
import linkedin from '@idio/linkedin'

(async () => {
  const res = await linkedin({
    text: 'example',
  })
  console.log(res)
})()
```
```
example
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Copyright

(c) [Idio][1] 2018

[1]: https://idio.cc

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>