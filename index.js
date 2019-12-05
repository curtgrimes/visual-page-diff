const HTMLPageDiff = require("./lib/HTMLPageDiff");

HTMLPageDiff({
  // Optional. If Chrome can't automatically be detected, place
  // the Chrome or Chromium executable path here.
  // executablePath: "/usr/bin/google-chrome",

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
