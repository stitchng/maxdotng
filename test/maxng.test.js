'use strict'

var chai = require('chai')
var expect = chai.expect
var should = chai.should()

describe('MaxNG Instance Test(s)', function () {
  // Created Instance
  var MaxNG = require('../index.js')
  var isProd = (process.env.NODE_ENV === 'production')
  var instance = new MaxNG('pk_1IkXmSWOlE4y9Inhgyd6g5f2R7', isProd)

  it('should have all methods defined', function () {
    /* eslint-disable no-unused-expressions */
    expect((typeof instance.getDeliveryRequestStatus === 'function')).to.be.true
    expect((typeof instance.getOrderPickupWindows === 'function')).to.be.true
    expect((typeof instance.scheduleDeliveryRequest === 'function')).to.be.true
    expect((typeof instance.getDeliveryRequest === 'function')).to.be.true
    /* eslint-enable no-unused-expressions */
  })

  it('should throw an error if [scheduleDeliveryRequest] method is called without required arguments', function () {
    try {
      instance.scheduleDeliveryRequest()
    } catch (err) {
      should.exist(err)
    }
  })
})
