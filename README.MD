React Searchkit based search developed as open source project for city of Turku and later for wider use. It is intented to be used as event calendar search and will be integrated to Drupal.

Installation:

- Install Node.js / NPM 3.x or newer with your preferred package manager or with the official binaries (https://nodejs.org/en/download/). 
- Install TSD(Yes, it's deprecated. Will be fixed later.):
	- `npm install tsd -g`
- `tsd install`
- `npm install`
- `ES_URL=http://demo.searchkit.co/api npm start`
- visit http://localhost:3000 or http://localhost:3000/demo/demo1

Also installation of Elastic Search 2.x(for now, later 5.x) is recommended although this code currently runs search against searchkits demo API.