## Start project

```
$ node server.js
```


## How to crop images via Cloudinary's Upload Widget?
https://support.cloudinary.com/hc/en-us/articles/203062071-How-to-crop-images-via-the-Upload-Widget-



1.[ Select or create a Cloud Platform project](https://console.cloud.google.com/project).
2. [Enable billing for your project](https://support.google.com/cloud/answer/6293499#enable-billing).
3. [Enable the Google Cloud Vision API](https://console.cloud.google.com/flows/enableapi?apiid=vision.googleapis.com).
4. [Set up authentication with a service account](https://cloud.google.com/docs/authentication/getting-started) so you can access the API from your local workstation.
https://googleapis.dev/nodejs/vision/latest/
  - Create service account with a role
  - Create credentials to access your enabled API > API Keys.
    A json file will be downloaded. This contains the private keys for the service account.
  API key will be created. Use this key in your application by passing it with the key=API_KEY parameter.
  AIzaSyB9hNvg3tpJIh9ps6bc5xwFpg9iqVC-OCE

5. Launch server.
6. If error in terminal is "This API method requires billing to be enabled. Please enable billing". Click on the link in the terminal and select a billing account.





[Project Settings](https://console.developers.google.com/admin/settings?project=ingredient-checker-294916)

1. [Create a project](https://console.cloud.google.com/projectselector2/home/dashboard?_ga=2.204583193.863645533.1604759200-862013615.1604759200)