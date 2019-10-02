const express = require('express');
const helmet = require('helmet');

const server =  express();

function creepy(req, res, next) {
    //next a way to move the req to the next arm on the automated assembly line. How it continues down the array of the assembly line
    res.status(200).json({ you: "i see you"});
}

function banana(req, res, next) {
    console.log('banana'); //before without a produced response the request timed out when banana is referrenced below first
    next(); //function that points and calls the next middleware passed from .use function that is calling creeping and gives it the parameters. 
}

server.use(express.json()); //global built in middleware applies to all requests
server.use(helmet()); //global third party middleware security defaults npmjs.com add to all projects
server.use(banana); //needs to call next so creepy gets exicuted or else the req times outs. The order of middleware matters. top to bottom exicution.
server.use(creepy);


server.get('/', (req, res) => {
    res.status(200).json({ api: 'up and running'});
});

server.listen(8000, () => console.log('api up on port 8000'));

//Validation should happen after you get the data you should validate before you do anything with it.
//npm i helmet to install 3rd-party middleware

//middleware is a function that is reuseable code 