const sharp = require("sharp");
const PNG = require("pngjs").PNG;

// Make img1 and img2 the same size if they aren't already
module.exports = async (img1, img2) => {
  let image1resized, image2resized;

  let imageWithSmallerWidth, imageWithSmallerHeight;

  if (img1.width !== img2.width) {
    // Widths are different
    imageWithSmallerWidth = img1.width < img2.width ? img1 : img2;
  }

  if (img1.height !== img2.height) {
    // Heights are different
    imageWithSmallerHeight = img1.height < img2.height ? img1 : img2;
  }

  if (imageWithSmallerWidth) {
    console.log(imageWithSmallerWidth);
    let resizedImageWidth = await sharp(PNG.sync.write(imageWithSmallerWidth))
      .resize({
        width: Math.max(img1.width, img2.width),
        height: imageWithSmallerWidth.height,
        fit: "contain",
        position: "left top"
      })
      .toBuffer();

    if (imageWithSmallerWidth === img1) {
      img1 = PNG.sync.read(resizedImageWidth);
    } else {
      img2 = PNG.sync.read(resizedImageWidth);
    }
  }

  if (imageWithSmallerHeight) {
    let resizedImageHeight = await sharp(PNG.sync.write(imageWithSmallerHeight))
      .resize({
        width: imageWithSmallerHeight.width,
        height: Math.max(img1.height, img2.height),
        fit: "contain",
        position: "left top"
      })
      .toBuffer();

    if (imageWithSmallerHeight === img1) {
      img1 = PNG.sync.read(resizedImageHeight);
    } else {
      img2 = PNG.sync.read(resizedImageHeight);
    }
  }

  return [img1, img2];
};
