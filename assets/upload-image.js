const form = document.querySelector('form')
const btnUploadImage = document.querySelector('[data-upload-image]')
const btnSubmit = document.querySelector('[data-submit]')
const inputImageUrl = document.querySelector('[data-image-url]')
const imagePreview = document.querySelector('[data-image-preview]')
const imagePreviewContainer = document.querySelector('[data-image-preview-container]')
const results = document.querySelector('[data-results]')
let urlUploadedPhoto

btnUploadImage.addEventListener('click', onClickUploadImage)
form.addEventListener('submit', onSubmitForm)

function onClickUploadImage(event) {
	if (typeof cloudinary !== 'undefined') {
		cloudinary.openUploadWidget({
			cloud_name: 'dlsvtbju7',
			api_key: '825543594531569',
			upload_preset: 'ulpjnbur',
			folder: 'ingredients',
			multiple: false,
			gravity: 'custom',
			cropping: 'server',
			cropping_show_back_button: true,
			resource_type: 'image',
			client_allowed_formats: ['png', 'jpeg'],
			theme: 'minimal',
		},
			(error, result) => {
				if (result && result[0] && typeof result[0].url !== 'undefined') {
					urlUploadedPhoto = result[0].url
					inputImageUrl.setAttribute('value', urlUploadedPhoto)
					imagePreview.setAttribute('src', inputImageUrl.getAttribute('value'))
					imagePreviewContainer.removeAttribute('hidden')
					btnSubmit.removeAttribute('hidden')
					results.textContent = ''
				} else {
					if (error.message === 'User closed widget') {
						return
					}
					console.error('Something went wrong with uploading the photo via Cloudinary', error)
					urlUploadedPhoto = ''
				}
			})
	}
}

function onSubmitForm(event) {
	event.preventDefault()
	let formData = new FormData(form);
	for (var key of formData.entries()) {
		console.log(key[0] + ', ' + key[1]);
	}

	fetch('/analyze-image', {
		method: 'POST',
		headers: {
			"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
		},
		body: `imageUrl=${inputImageUrl.getAttribute('value')}`
	})
	.then(response => {
		console.log('status', response.status)
		return response.json()
	})
	.then(response => {
		console.log(response)
		results.textContent = JSON.stringify(response, null, 4)
	})
	.catch(error => console.error('error', error))
}