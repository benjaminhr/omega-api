# omega-api
For the office light
 
 - `api.js` holds routing for api
    - omega polls url for "down"
    - `pingdom.js` posts to url if something is "down", and "up" otherwise
    - `flowdock.js` handles sending notifications

 - Up and Running: 
    - `npm install`
    - `node api.js`
    - `node pingdom.js`
