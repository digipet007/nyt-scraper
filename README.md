# nyt-scraper

## Getting Started

The New York Times Scraper is a web app that lets users view and leave comments on the latest news. It was built with MongoDB, Mongoose, Node, Express, and Handlebars.

![demo](demo/nytscraper1.gif)

For a demo of the app, visit: <https://aqueous-castle-58496.herokuapp.com>

### Prerequisites

To download and test this app, you will need the Node Packet Manager installed.  For more information, visit: <https://www.npmjs.com/get-npm>

You will also need Node.js installed.  For more information, visit <https://nodejs.org/en/download/>

### Installing

To install, access the Github page <https://github.com/digipet007/nyt-scraper>.  You may fork the repository and then clone it to your computer.  

Next, you will need to download the required NPM packages.  The required NPM packages include:
```
"axios": "^0.19.0",
"body-parser": "^1.19.0",
"cheerio": "^1.0.0-rc.3",
"express": "^4.17.1",
"express-handlebars": "^3.1.0",
"mongoose": "^5.7.12"
```
Because these packages are listed as dependencies already in the package.json file, you may install these packages by typing `npm install` on the commandline.

You will also need MongoDB installed for your database <https://www.mongodb.com/download-center>

Your app should now be ready for testing and then deployment.

Then, To use this app on your local device, and store the data in Mongo, run the following command on the command line:
```
node server.js
```

Then go to the following URL in your browser: `localhost:8080`
You should be able to scrape new articles, save them, and add/remove notes.

## Deployment and General Use
This app can be deployed to a server, such as Heroku or AWS, for online use from different users in different locations. To store data input, you will need to utilize an online database, such as the JAWSDB_URL add-on offered by Heroku.

## Built With

* Javascript
* Bootstrap Framework
* JQuery
* MongoDB

## Author

* **Sarah Arnold** --view my portfolio and bio: <https://digipet007.github.io/Sarahs-Portfolio/>