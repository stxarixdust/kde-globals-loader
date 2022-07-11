# KDE Globals Loader

This module can find paths to the KDE global config files and get their contents
as objects. Obviously, it is Linux-only.

## Usage

This module has two functions:

  * `getGlobals()` gets all globals values as an object.
  * `getGlobalsPath()` gets the path to the globals config file, to be read and
    parsed as an `.ini` file

## Examples

Active color scheme name and values

```js
require("kde-globals-loader").getGlobals().then(data => {
  console.log("Your current color scheme is "
    + data.General.ColorScheme
    + ". It has the following RGB color values:"
  );
  console.log("Window background: " + data["Colors:Window"].BackgroundNormal);
  console.log("View background: " + data["Colors:View"].BackgroundNormal);
  console.log("View foreground: " + data["Colors:View"].ForegroundNormal);
});
```

Text font size and name

```js
require("kde-globals-loader").getGlobals().then(data => {
  let font = data.General.font.split(",");
  console.log(`You're using the font "${font[0]}" at ${font[1]}pt size`);
});
```

Globals file location

```js
require("kde-globals-loader").getGlobalsPath().then(path => {
  console.log("Your globals are stored at " + path);
});
```