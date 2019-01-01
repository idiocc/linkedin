## API

The package is available by importing its default function:

```js
import linkedin from '@idio/linkedin'
```

%~%

```## linkedin
[
  ["router", "Router"],
  ["config", "Config"]
]
```

Sets up the `/auth/linkedin` and `/auth/linkedin/redirect` paths on the router to enable LinkedIn App Login. The session middleware needs to be installed to remember the state. The state is destroyed after the redirect.

%TYPEDEF types/index.xml Config%

%EXAMPLE: example/example.js, ../src => @idio/linkedin%
%FORK example example/example%

%~ width="15"%

### finish

The config allows to set the finish function that can be used to alter the logic of setting the token on the session or performing additional operations such as storing a new user in the database. The default sets the token on the `ctx.session` and also sets the user data such as name and id in the `ctx.session.user` property.

%~ width="15"%

```## query
[
  ["config", "QueryConfig"]
]
```

The query method allows to query the LinkedIn API. The `v2` version of the API only allows to query basic data with the `r_liteprofile` permission. The other methods of the API are not pubic. This package will automatically query the `/me` route to find out the user's name and profile picture, therefore specifying the `r_liteprofile` scope is required. The `v1` version which is used to query positions with the `r_basicprofile` scope will be switched off in March 2019.

%TYPEDEF types/index.xml QueryConfig%

%~%

## Button

The package provides the sign-in SVG button with the PNG fallback:

![Sing In With LinkedIn](https://raw.github.com/idiocc/linkedin/master/img/button.svg?sanitize=true)

```html
<a href="/auth/linkedin" title="Sign In with LinkedIn">
  <object data="button.svg" type="image/svg+xml">
    <img src="linkedin.png">
  </object>
</a>
```