const browserSync = require("browser-sync")
const express = require("express")
const shrinkRay = require("shrink-ray")
const bodyParser = require("body-parser");
const app = express()
const port = 9777
const ingredientsRoute = require('./get-ingredients')

// you can conditionally add routes and behaviour based on environment
const isProduction = "production" === process.env.NODE_ENV

app.set("etag", isProduction)
app.set('view engine', 'ejs')

app.use((req, res, next) => {
  res.removeHeader("X-Powered-By")
  next()
})

app.use(bodyParser.urlencoded({
	extended: true
}))

app.use(bodyParser.json())

app.use(shrinkRay())
app.use("/assets", express.static("assets/", { etag: isProduction, lastModified: false }))

app.get("/", (req, res) => {
	res.render('index')
})

app.post('/image', ingredientsRoute)

app.listen(port, listening)

function listening() {
  console.log(`Demo server available on http://localhost:${port}`)
  if (!isProduction) {
    // https://ponyfoo.com/articles/a-browsersync-primer#inside-a-node-application
    browserSync({
      files: ["src/**/*.{html,js,css}"],
      online: false,
      open: false,
      port: port + 1,
      proxy: "localhost:" + port,
      ui: false
    })
  }
}
