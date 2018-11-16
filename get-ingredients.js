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
			const detections = results[0].textAnnotations
			if (detections.length) {
				console.log(detections[0])
				const result = detections[0]
				const locale = result.locale
				const description = result.description
				res.send(`language: ${locale}, text: ${description}`)
			}
			res.send('Could not detect text in the uploaded image. Please try another image.')
			//detections.forEach((text, index) => index === 0 ? console.log(text) : '');
		})
		.catch(err => {
			console.error(err);
		})
}

// @todo: create array of ingredients and send it to ingredients api to analyze