"use strict";

/**
 * TODOS
 * Ik return dotAfterIngredients en dat is soms undefined, omdat niet alle ingredienten een dot op het eind hebben.
 * Dat levert een 'SyntaxError: Unexpected end of JSON input at fetch.then.response' op.
 * De Fulltext gebruiken en hier op checken. Net als de Ruby app.
 */

const dotenv = require("dotenv");
const vision = require("@google-cloud/vision");

dotenv.config();

const getFirst = (arr) => arr.slice(1);

function hasText(arr) {
  return getFirst(arr).some(
    (text) => text.description.toLowerCase() === "ingrediënten" || "ingredients"
  );
}

/**
 * By default, the client will authenticate using the service account file
specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
the project specified by the GCLOUD_PROJECT environment variable. See
https://cloud.google.com/docs/authentication/getting-started#setting_the_environment_variable
 */

// Instantiate a vision client
const client = new vision.ImageAnnotatorClient();

module.exports = async function (req, res) {
  // Response for uploaded image url from Cloudinary
  const imageUrl = req.body.imageUrl;

  if (!imageUrl) {
    const message = "imageUrl is missing";
    res.json({ error: message });
    throw new Error(message);
  }

  try {
    const results = await client.textDetection(imageUrl);
    if (!results.length) {
      const message =
        "Could not detect text in the uploaded image. Please try another image.";
      res.json({ error: message });
      throw new Error(message);
    }

    /** BEGIN TEST full text annotations */
    const document = results[0].fullTextAnnotation;
    console.log(
      document.pages[0].blocks,
      document.pages[0].property.detectedLanguages
    );
    console.log(
      document.pages[0].blocks.forEach((block) => {
        console.log(block.paragraphs);
      })
    );
    /** END TEST */

    const detections = results[0].textAnnotations;

    if (!hasText(detections)) {
      const message =
        "It seems the uploaded photo doesn't contain ingredients. Please upload another photo.";
      res.json({ error: message });
      throw new Error(message);
    }

    // Map only prop 'description' to an array
    const texts = getFirst(detections).map((item) =>
      item.description.toLowerCase()
    );
    const ingredientsIndex = texts.findIndex(
      (element) =>
        element === "ingrediënten" ||
        element === "ingrediënten:" ||
        element === "ingredients" ||
        element === "ingredienten" ||
        element === "INGREDIENTEN" ||
        element === "ingredients:"
    );

    if (ingredientsIndex === -1) {
      const message =
        'Could not find the text "ingredients". Please upload another photo.';
      res.json({ error: message });
      throw new Error(message);
    }
    // Remove all text before the lowercased text 'ingrediënten'
    const afterIngredients = texts.slice(ingredientsIndex);
    // console.log("after ingredients", afterIngredients);

    const dotAfterIngredientsIndex = afterIngredients.findIndex(
      (element, index) => {
        console.log(element);
        if (element[element.length - 1] === "." || element === ".") {
          //   console.log("dot found", element);
          return true;
        }
        return false;
      }
    );
    const notesIndex = afterIngredients.findIndex((element, index) => {
      if (
        (element === "kan" && afterIngredients[index + 1] === "sporen") ||
        ((element === "koel" || element === "donker") &&
          afterIngredients[index + 1] === "bewaren") ||
        (element === "voedingswaarde" && afterIngredients[index + 1] === "per")
      ) {
        return true;
      }
      return false;
    });

    let notesIngredients;
    let dotAfterIngredients;
    if (dotAfterIngredientsIndex !== -1) {
      dotAfterIngredients = afterIngredients.slice(
        0,
        dotAfterIngredientsIndex + 1
      );
      //   console.log("dotAfterIngredients EXISTS!");
    } else {
      if (notesIndex !== -1) {
        notesIngredients = afterIngredients.slice(0, notesIndex);
      }
    }

    const fullText = results[0]; // only for testing
    // console.log("fullText", fullText);
    // console.log('notesIngredients', notesIngredients)
    // console.log("dotAfterIngredients", dotAfterIngredients);
    res.json(dotAfterIngredients);
  } catch (error) {
    console.error(error);
  }

  // Performs label detection on the image file
};
