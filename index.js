const express = require('express');
const helmet = require('helmet');

const server =  express();

function creepy(req, res, next) {
    const method = req.method;
    const url = req.url;
    //next a way to move the req to the next arm on the automated assembly line. How it continues down the array of the assembly line
    // res.status(200).json({ you: "i see you"});
    console.log(`you made a ${method} request to ${url}`); //"interpolation" of the string with back ticks
    next();
}

function banana(req, res, next) {
    console.log('bananax'); //before without a produced response the request timed out when banana is referrenced below first
    next(); //function that points and calls the next middleware passed from .use function that is calling creeping and gives it the parameters. 
}

function protected(req, res, next) {
    //read a password from the req header
    //if the password is melon let the req cont
    //else cancel or stop the req send back 401
    const password = req.headers.password;
    if(password && password.toLowerCase() === "mellon") {
        next();
    } else {
        res.status(401).json({ you: "shall not pass"});
    }
}

//mw that read a name from a query string param (localhost:8000?name=Andy) so the next mw can read it (passing data from one mw to the next mw)
//if you want to use error handling mw, you will need to know how to pass on data between mw

function nameReader(req, res, next) {
    req.name = req.query.name;
    next();
}

//server.use('/api', protected, apiRouter); example of using it with routers
server.use(express.json()); //global built in middleware applies to all requests
server.use(helmet()); //global third party middleware security defaults npmjs.com add to all projects
// server.use(banana); //needs to call next so creepy gets exicuted or else the req times outs. The order of middleware matters. top to bottom exicution. and left to right when added in. USed globally or locally
server.use(creepy);
// in JS, if undefined, app will crash when trying to read value. That is why you check to make sure you have a user before you make it do stuff. Undefined stuff crashes an app


server.get('/', nameReader, (req, res) => { //only using banana as a local middleware no longer a global can give it more than one middleware, THE ORDER MATTERS WHEN ADDING FUNCTIONS
    const name = req.name;
    console.log(name);
    res.status(200).json({ api: 'up and running'});
});

server.get('/secret', protected, (req, res) => {
    res.status(200).json({ welcome: 'secret agent'});
});

server.listen(8000, () => console.log('api up on port 8000'));

//Validation should happen after you get the data you should validate before you do anything with it.
//npm i helmet to install 3rd-party middleware

//middleware is a function that is reuseable code 
//only post put patch have access to a body. get request does not have a body. passwords are passed securely in headers only. not in url or body. You can get information
//from HEADERS, URL PARAMS, QUERY STRING, or BODY