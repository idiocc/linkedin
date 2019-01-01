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

%TYPEDEF types/index.xml%

%EXAMPLE: example/example.js, ../src => @idio/linkedin%
%FORK example example/example%

%~ width="15"%

### finish

The config allows to set the finish function that can be used to alter the logic of setting the token on the session or performing additional operations such as storing a new user in the database. The default sets the token on the `ctx.session` and also sets the user data such as name and id in the `ctx.session.user` property.

%~ width="15"%

### query

The query method allows to query the LinkedIn API.

%~%