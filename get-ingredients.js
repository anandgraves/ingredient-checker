const dotenv = require('dotenv')
const vision = require('@google-cloud/vision')
const util = require('util')
const ramda = require('ramda')

dotenv.config()	

const getFirst = arr => arr.slice(1)

function hasText(arr) {
	return getFirst(arr).some(text => text.description.toLowerCase() === 'ingrediënten' || 'ingredients')
}

module.exports = function (req, res) {
	const imageUrl = req.body.imageUrl
	console.log('imageUrl', imageUrl)
	
	if (!imageUrl) {
		const message = 'imageUrl is missing'
		res.json({ error: message })
		throw new Error(message)
	}

	const client = new vision.ImageAnnotatorClient()

	// Performs label detection on the image file
	client
		.textDetection(imageUrl)
		.then(results => {
			if (!results.length) {
				const message = 'Could not detect text in the uploaded image. Please try another image.'
				res.json({ error: message })
				throw new Error(message)
			}

			const detections = results[0].textAnnotations			
			
			if (!hasText(detections)) {
				const message = 'It seems the uploaded photo doesn\'t contain ingredients. Please upload another photo.'
				res.json({ error: message })
				throw new Error(message)
			}

			// Map only prop 'description' to an array
			const texts = getFirst(detections).map(item => item.description.toLowerCase())
			const ingredientsIndex = texts.findIndex(element => 
				element === 'ingrediënten' || 
				element === 'ingrediënten:' ||
				element === 'ingredients' ||
				element === 'ingredients:')	

			if (ingredientsIndex === -1) {
				const message = 'Could not find the text "ingredients". Please upload another photo.'
				res.json({ error: message })
				throw new Error(message)
			}
			// Remove all text before the lowercased text 'ingrediënten'
			const afterIngredients = texts.slice(ingredientsIndex)
			console.log('after ingredients', afterIngredients)

			const dotAfterIngredientsIndex = afterIngredients.findIndex((element, index) => {
				console.log(element)
				if (element[element.length - 1] === '.' || element === '.') {
					console.log('dot found', element)
					return true
				}
				return false
			})
			const notesIndex = afterIngredients.findIndex((element, index) => {
				if ((element === 'kan' && afterIngredients[index + 1] === 'sporen') ||
				((element === 'koel' || element === 'donker') && afterIngredients[index + 1] === 'bewaren') ||
				(element === 'voedingswaarde' && afterIngredients[index + 1] === 'per')) {
					return true
				}
				return false
			})

			let notesIngredients
			let dotAfterIngredients
			if (dotAfterIngredientsIndex !== -1) {
				dotAfterIngredients = afterIngredients.slice(0, dotAfterIngredientsIndex + 1)
				console.log('dotAfterIngredients EXISTS!')
			} 
			else {
				if (notesIndex !== -1) {
					notesIngredients = afterIngredients.slice(0, notesIndex)
				}
			}

			const fullText = results[0] // only for testing
			// console.log('fullText', fullText)
			// console.log('notesIngredients', notesIngredients)
			// console.log('dotAfterIngredients', dotAfterIngredients)
			res.json(dotAfterIngredients)
		})
		.catch(err => {
			console.error(err);
		})
}
