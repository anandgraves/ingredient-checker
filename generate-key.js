const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()	

if (!process.env.KEY_FILE_GOOGLE_VISION) {
	throw new Error('Env variable KEY_FILE_GOOGLE_VISION is empty.')
}

const keyFileContents = process.env.KEY_FILE_GOOGLE_VISION
let buff = new Buffer(keyFileContents, 'base64')
let text = buff.toString('ascii')
fs.writeFileSync('./data/ingredients-a95c604086c3.json', text)