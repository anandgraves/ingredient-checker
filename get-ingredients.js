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

			const fullText = results[0]
			console.log('results 0', fullText)
			
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

			if (ingredientsIndex === -1) {
				const message = 'Could not find the text "ingredients". Please upload another photo.'
				res.send(message)
				throw new Error(message)
			}
			const afterIngredients = texts.slice(ingredientsIndex)
			console.log('after ingredients', afterIngredients)

			// Check for notes, such as 'kan sporen van ... bevatten'
			const notesIndex = afterIngredients.findIndex((element, index) => {
				if ((element === 'kan' && afterIngredients[index + 1] === 'sporen') ||
				((element === 'koel' || element === 'donker') && afterIngredients[index + 1] === 'bewaren')) {
					return true
				}
				return false
			})
			console.log('notesIndex', notesIndex, afterIngredients[notesIndex])
			let notesIngredients
			if (notesIndex !== -1) {
				notesIngredients = afterIngredients.slice(0, notesIndex)
			}

			const output = `
				after ingredients: ${afterIngredients}\n

				${results[0].textAnnotations.description}\n

				Full text annotation: ${results[0].fullTextAnnotation.text}\n

				Notes ingredients: ${notesIngredients}
			`
			
			res.send(output)
		})
		.catch(err => {
			console.error(err);
		})
}

// @todo: create array of ingredients and send it to ingredients api to analyze