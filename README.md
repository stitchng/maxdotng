# maxdotng

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

A NodeJS Wrapper for [MaxNG](https://developers.max.ng)

## Overview
This project provides an easy-to-use object-oriented API to access endpoints delineated at https://maxv1.docs.apiary.io/

## Installation

>Install from the NPM Registry

```bash

  npm i --save maxng-nodejs

```

## Usage

```js

let MaxNg = require('maxng-nodejs')

const APIKEY = 'pk_1IkXmSWOlE4y9Inhgyd6g5f2R7'
const environment = process.env.NODE_ENV
const isProduction = (environment === 'production')

const maxdotng = new MaxNg(APIKEY, isProduction);

let response = {body:{}};
const date_time = new Date('2019-12-30')

try {
  response = await maxdotng.getPickUpWindow({
    pickup_datetime: date_time
  });
}catch(err){
    console.error(err);
}

```

## API Resources

- maxdotng.getDeliveryRequestStatus()
- maxdotng.getOrderPickupWindows()
- maxdotng.scheduleDeliveryRequest()
- maxdotng.getDeliveryRequest()
- maxdotng.getPickUpWindow()

## License

MIT

# Contributing

You are welcome to contribute to this project. Just before sending us a PR, do the following below:

>Firstly, clone the project

```bash

git clone https://www.github.com/stitchng/maxdotng

```

>Then, lint the code to conform to our code style
```bash

npm run lint

```
>Finally, add tests to the test folder to test your code and run tests locally

```bash

npm run test

```


## Credits

- [Ifeora Okechukwu](https://twitter.com/isocroft)

## Contributing

See the [CONTRIBUTING.md](https://github.com/stitchng/maxdotng/blob/master/CONTRIBUTING.md) file for info

[npm-image]: https://img.shields.io/npm/v/maxng-nodejs.svg?style=flat-square
[npm-url]: https://npmjs.org/package/maxng-nodejs

[travis-image]: https://img.shields.io/travis/stitchng/maxdotng/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/stitchng/maxdotng
