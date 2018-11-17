const btnUploadImage = document.querySelector('[data-upload-image]')
const btnSubmit = document.querySelector('[data-submit]')
const inputImageUrl = document.querySelector('[data-image-url]')
let urlUploadedPhoto

btnUploadImage.addEventListener('click', onClickUploadImage)

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
					btnSubmit.removeAttribute('hidden')
				} else {
					console.error('Something went wrong with uploading the photo via Cloudinary', error)
					urlUploadedPhoto = ''
				}
			})
	}
}