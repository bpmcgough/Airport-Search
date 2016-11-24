Hello! Thank you for reading me. A few notes about this app:
- It is designed under the assumption that the user knows exactly what it's purpose is.
- I understand that I could have easily used an API to retrieve the flight data, but I thought it'd be more fun,
  not to mention much faster, to query my own mini database.
- I also understand that there are a slew of autocomplete npm packages, but again I thought it'd be more fun to make my own.
- In any other application, I most likely would have used a framework, but since this application is so lightweight,
  I figured it'd be faster to go about the DOM manipulation by hand. This makes for ugly looking code in some places, unfortunately.
- I kept the styling of the app minimalist, I think where it shines is in the handmade features.

A breakdown of the codebase:
- main.js: Brain of the app, creates autocomplete tree, handles search, displays results
- maps.js: Holds Google Maps initMap function, along with distance calculator
- theNewAirports.js: Contains array of airport objects
...and the rest is self explanatory.

To run the app, you only need to open index.html in your browser.

Thank you for your consideration!
- Brian
