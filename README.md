# maxdotng

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

A NodeJS Wrapper for [MaxNG](https://developers.max.ng)

## Overview
This project provides an easy-to-use object-oriented API to access endpoints delineated at https://developers.max.ng/signup

## Installation

>Install from the NPM Registry

```bash

  npm i --save maxng-nodejs

```

# Usage

```js

let InfoBip = require('maxng-nodejs')

let APIKEY = 'pk_1IkXmSWOlE4y9Inhgyd6g5f2R7'
const environment = process.env.NODE_ENV
const isProduction = (environment === 'production')

const maxdotng = new MaxNg(APIKEY, isProduction)

```

## API Resources

- maxdotng.getDeliveryRequestStatus()
- maxdotng.getOrderPickupWindows()
- maxdotng.scheduleDeliveryRequest()
- maxdotng.getDeliveryRequest()
- maxdotng.getPickUpWindow()

# License

MIT

# Credits

- [Ifeora Okechukwu](https://twitter.com/isocroft)

# Contributing

See the [CONTRIBUTING.md](https://github.com/stitchng/maxdotng/blob/master/CONTRIBUTING.md) file for info

[npm-image]: https://img.shields.io/npm/v/maxng-nodejs.svg?style=flat-square
[npm-url]: https://npmjs.org/package/maxng-nodejs

[travis-image]: https://img.shields.io/travis/stitchng/maxdotng/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/stitchng/maxdotng
