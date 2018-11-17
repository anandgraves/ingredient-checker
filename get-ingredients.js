const dotenv = require('dotenv')
const vision = require('@google-cloud/vision')
const util = require('util')

dotenv.config()	

module.exports = function (req, res) {
	const imageUrl = req.body.imageUrl
	if (!imageUrl) {
		throw new Error('imageUrl is missing')
	}

	const client = new vision.ImageAnnotatorClient()

	// Performs label detection on the image file
	client
		.textDetection(imageUrl)
		.then(results => {
			if (results.length === 0) {
				message = 'Could not detect text in the uploaded image. Please try another image.'
				res.send(message)
				throw new Error(message)
			}

			const detections = results[0].textAnnotations
			
			if (detections.length === 0) {
				res.send('Could not detect text in the uploaded image. Please try another image.')
			}
			
			let hasIngredients = detections.slice(1).some(text => text.description.toLowerCase() === 'ingrediënten' || 'ingredients')
			if (!hasIngredients) {
				const message = 'It seems the uploaded photo doesn\'t contain ingredients. Please upload another photo.'
				res.send(message)
				throw new Error(message)
			}

			const texts = detections.slice(1).map(item => item.description.toLowerCase())
			const ingredientsIndex = texts.findIndex(element => 
				element === 'ingrediënten' || 
				element === 'ingrediënten:' ||
				element === 'ingredients' ||
				element === 'ingredients:')
			console.log('ingredientsIndex', ingredientsIndex)
			if (ingredientsIndex === -1) {
				const message = 'Could not find the text "ingredients". Please upload another photo.'
				res.send(message)
				throw new Error(message)
			}
			const afterIngredients = texts.slice(ingredientsIndex)
			console.log('after ingredients', afterIngredients)

			// console.log(results[0].fullTextAnnotation.text)
			// res.send(JSON.stringify(ingredients), null, 4)
		})
		.catch(err => {
			console.error(err);
		})
}

// @todo: create array of ingredients and send it to ingredients api to analyze