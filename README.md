# Visual Page Diff

A Node.js script for running arbitrary JavaScript against a set of pages and comparing before and after screenshots of each page for changes. Uses [Puppeteer](https://github.com/puppeteer/puppeteer) to take screenshots of pages in a headless Chrome instance and [Pixelmatch](https://github.com/mapbox/pixelmatch) to compare screenshots.

## Usage

Use [index.js](index.js) as a starting point. Run index.js using Node with a command like `node index.js`. Diffs (if any) will be generated and placed in a diffs folder. The console will show progress and indicate if any diffs were found.

Here are some usage examples:

```js
const HTMLPageDiff = require("./lib/HTMLPageDiff");

HTMLPageDiff({
  // Optional. If Chrome can't automatically be detected, place
  // the Chrome or Chromium executable path here.
  executablePath: "/usr/bin/google-chrome",

  // Whether or not to also save before and after screenshots
  // in addition to the visual diff if a difference is detected
  // Default: false
  saveBeforeAfter: true,

  // Run this function to create the "after" screenshot
  functionBeforeScreenshot: () => {
    // Examples

    // Word replacement
    // document.body.innerHTML = document.body.innerHTML.replace(
    //   /Stevenson/g,
    //   "Stephenson"
    // );

    // Remove stylesheets from a specific origin
    // document
    //   .querySelector(
    //     '[rel="stylesheet"][href^="https://stackpath.bootstrapcdn.com"]'
    //   )
    //   .remove();

    // Remove stylesheet matching a URL
    // document
    //   .querySelector(
    //     '[type="text/css"][href="/masterto/themes/Theme_4_0/css/niu-styles-theme4.0.css"]'
    //   )
    // .remove();

    // Add a new external stylesheet
    // let cssStylesheet = document.createElement("link");
    // cssStylesheet.setAttribute("rel", "stylesheet");
    // cssStylesheet.setAttribute("type", "text/css");
    // cssStylesheet.setAttribute("href", "");
    // document.getElementsByTagName("head")[0].appendChild(cssStylesheet);

    // Add literal styles
    let node = document.createElement("style");
    document.body.appendChild(node);
    node.innerHTML = "h2, h3, h4 { color: blue }";
  },

  // List of URLs to check
  urls: [
    "https://niu.edu/financial-aid",
    "https://www.niu.edu/financial-aid/about/index.shtml",
    "https://www.niu.edu/financial-aid/about/policies.shtml",
    "https://www.niu.edu/financial-aid/grants/federal.shtml",
    "https://www.niu.edu/financial-aid/grants/huskie-pledge/index.shtml"
  ]
});
```

After running, if there are any diffs, a new `diffs` folder will contain images. If `saveBeforeAfter` is `true`, diffs will also contain the before and after images for each page that has a diff. In the example above, each `h2`, `h3`, and `h4` is set to `color: blue`. Files are named based off of their original URLs.

- financial-aid-before.png
  ![](screenshots/financial-aid-before.png)

- financial-aid-after.png
  ![](screenshots/financial-aid-after.png)

- financial-aid.png (diff)
  ![](screenshots/financial-aid.png)
