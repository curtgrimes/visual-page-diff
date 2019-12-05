const puppeteer = require("puppeteer");
const pixelmatch = require("pixelmatch");
const fs = require("fs");
const PNG = require("pngjs").PNG;
const url = require("url");
const equalizeImageSize = require("./EqualizeImageSize");
const rimraf = require("rimraf");

function urlToFilename(urlString) {
  // Replace slashes in path with filename-safe underscores
  let filename = url.parse(urlString).pathname.replace(/\//g, "_");

  // Remove leading or trailing underscores for simplicity
  return filename.replace(/^\_+|\_+$/g, "");
}

function getScreenshot({ browser, url, functionBeforeScreenshot = null }) {
  return new Promise(async resolve => {
    const page = await browser.newPage();
    await page.setViewport({
      width: 1440,
      height: 900,
      deviceScaleFactor: 1
    });

    await page.goto(url, { waitUntil: "networkidle0" });

    if (functionBeforeScreenshot) {
      await page.evaluate(functionBeforeScreenshot);
    }

    const screenshot = await page.screenshot({
      // path: urlToFilename(urls[0]) + ".png",
      fullPage: true
    });

    resolve(screenshot);
  });
}

module.exports = async ({
  executablePath,
  saveBeforeAfter = false,
  functionBeforeScreenshot,
  urls
}) => {
  // Clear diffs directory if it's already there
  rimraf.sync("./diffs");

  const browser = await puppeteer.launch({
    executablePath
  });

  //   Promise.all(
  for (let i = 0; i < urls.length; i++) {
    let url = urls[i];

    await new Promise(async (resolve, reject) => {
      console.log("Checking " + url + "...");

      const pageScreenshot1 = await getScreenshot({
        browser,
        url
      });
      const pageScreenshot2 = await getScreenshot({
        browser,
        url,
        functionBeforeScreenshot
      });

      equalizeImageSize(
        PNG.sync.read(pageScreenshot1),
        PNG.sync.read(pageScreenshot2)
      ).then(([img1, img2]) => {
        const { width, height } = img1;
        const diffCanvas = new PNG({ width, height });

        const mismatchedPixelCount = pixelmatch(
          img1.data,
          img2.data,
          diffCanvas.data,
          width,
          height,
          {
            threshold: 0.1
          }
        );

        if (mismatchedPixelCount > 0) {
          console.log(
            "Difference detected (" + mismatchedPixelCount + " pixels)."
          );

          if (!fs.existsSync("./diffs")) {
            fs.mkdirSync("./diffs");
          }

          fs.writeFileSync(
            "./diffs/" + urlToFilename(url) + ".png",
            PNG.sync.write(diffCanvas)
          );

          if (saveBeforeAfter) {
            fs.writeFileSync(
              "./diffs/" + urlToFilename(url) + "-before.png",
              PNG.sync.write(img1)
            );

            fs.writeFileSync(
              "./diffs/" + urlToFilename(url) + "-after.png",
              PNG.sync.write(img2)
            );
          }
        } else {
          console.log("No differences.");
        }
        resolve();
      });
    });
  }

  await browser.close();
};
