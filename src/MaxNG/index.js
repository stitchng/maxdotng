'use strict'

const got = require('got')
const querystring = require('querystring')
const _ = require('lodash')



const apiEndpoints = {
          getDeliveryRequestStatus:{
              path:"/{:order_id}/status",
              method:"GET",
              params:null,
              route_params:{order_id:String}
          },
          getOrderPickupWindows:{
              path:"/orders/windows",
              method:"GET",
              params:{pickup_datetime$: Date},
              route_params:null
          },
          getDeliveryRequest:{
              path:"/{:order_id}",
              method:"GET",
              params:null,
              route_params:{order_id:String}
          },
          getPickUpWindow:{
              path:"/pricings/estimate",
              method:"GET",
              params:{origin$: Object, destination$: Object, service_id$: String},
              route_params:null
          },
          scheduleDeliveryRequest:{
              path:"/order",
              method:"POST",
              send_json:true,
              params:{origin$:Object,destination:Object,sender_name:String,sender_phone$:String,recipient_name:String,is_card:Boolean,recipient_phone$:String,pickup_window$:Object,pickup_instruction:String,delivery_instruction:String,manifest:Array,service_id$:String},
              param_defaults: { is_card: false, pickup_instruction:'Please deliver this as soon as you can!' },
              route_params:null
          }
};





/*
 * Provides a convenience extension to _.isEmpty which allows for
 * determining an object as being empty based on either the default
 * implementation or by evaluating each property to undefined, in
 * which case the object is considered empty.
 */
_.mixin( function() {
  // reference the original implementation
  var _isEmpty = _.isEmpty; 
  return {
    // If defined is true, and value is an object, object is considered 
    // to be empty if all properties are undefined, otherwise the default 
    // implementation is invoked.
    isEmpty: function(value, defined) {
      if (defined && _.isObject(value)) {
        return !_.some( value, function(value, key) {
          return value !== undefined;
        });
      } 
      return _isEmpty(value);
    }
 }
}());


const isTypeOf = (_value, type) => {
    let value = Object(_value)
    return (value instanceof type)
};

const setPathName = (config, values) => {
    return config.path.replace(/\{\:([\w]+)\}/g, function(
                          match, 
                          string, 
                          offset ){
              let _value = values[string]
              return isTypeOf(
                          _value, 
                          config.route_params[string]
                      ) 
                    ? _value 
                    : null
    })
};

const _jsonify = (data) => {
	return !data ? 'null' :
		(typeof data === 'object'
			? (data instanceof Date ? data.toDateString() : (('toJSON' in data) ? data.toJSON().replace(/T|Z/g, ' ') : JSON.stringify(data)))
			: String(data))
};

const setInputValues = (config, inputs) => {
  let httpReqOptions = {}
  let inputValues = {}
  let label = ''

  switch (config.method) {
    case 'GET':
    case 'HEAD':
      label = 'query'
      break

    case 'POST':
    case 'PUT':
    case 'PATCH':
      label = 'body'
      break
  }

  httpReqOptions[label] = {}

  if (config.param_defaults) {
    inputs = Object.assign({}, config.param_defaults, inputs)
  }

  for (var input in config.params) {
    if (config.params.hasOwnProperty(input)) {
      let param = input.replace('$', '')
      let _input = inputs[param]
      let _type = config.params[input]
      let _required = false

      if ((input.indexOf('$') + 1) === (input.length)) {
        _required = true
      }

      if (_input === void 0 || _input === '' || _input === null) {
        if (_required) { throw new Error(`param: "${param}" is required but not provided; please provide as needed`) }
      } else {
        httpReqOptions[label][param] = isTypeOf(_input, _type)
          ? (label === 'query'
            ? querystring.escape(_jsonify(_input))
            : _jsonify(_input))
          : null

        if (httpReqOptions[label][param] === null) {
          throw new Error(`param: "${param}" is not of type ${_type.name}; please provided as needed`)
        }
      }
    }
  }

  inputValues[label] = (label === 'body'
    ? (config.send_form
      ? httpReqOptions[label]
      : JSON.stringify(httpReqOptions[label])
    )
    : querystring.stringify(httpReqOptions[label]))

  return inputValues
};

const makeMethod = function(config){
  
      let httpConfig = {
          headers:{
            'Cache-Control':'no-cache',
            'Accept': 'application/json'
          },
          json:true
      }
      
      if(config.send_json){
          httpConfig.headers['Content-Type'] = httpConfig.headers['Accept']
      }else if(config.send_form){
          httpConfig.headers['Content-Type'] = 'x-www-form-urlencoded'
      }
      
      return function(requestParams){
          let pathname = false
          let payload = false
          
          if(config.params !== null 
             && config.params.service_id$ === String){ 
              requestParams.service_id = this.api_service_id
          }
          
          if(!_.isEmpty(requestParams, true)){
              if(config.params !== null){
                  pathname = config.path
                  payload = setInputValues(config, requestParams)
              }
            
              if(config.route_params !== null){
                  pathname = setPathName(config, requestParams)
                  if(payload === false){
                      payload = {}
                  }
              }
          }else{
              if(config.params !== null 
                 || config.route_params !== null){
                throw new Error("requestParam(s) Are Not Meant To Be Empty!")    
             }
          }
        
          for(let type in payload){
              if(payload.hasOwnProperty(type)){
                  httpConfig[type] = payload[type]
              }
          }
          
          let reqVerb = config.method.toLowerCase()
          let baseUrl = this.httpClientBaseOptions.baseUrl

          return this.httpBaseClient[reqVerb](`${baseUrl}${pathname}`, httpConfig)
      };
};

class MaxNgAPI {
    constructor(apiKey, environment){
      
        var api_base = {
            sandbox:"https://sandbox.max.ng/v1",
            live:"https://api.max.ng/v1"
        };
      
        var api_service_ids = {
            sandbox:"e6f9a0b7-8f03-431f-a3da-7fbc914bbb72",
            live:"5838ffef-de7a-4593-86fb-7bda18b9667a"
        };
      
        this.environment = environment;
      
        this.api_service_id = this.environment === "development" ? api_service_ids['sandbox'] : api_service_ids['live'];
      
        /* SNIPPET:::START
        
        // items to be delivered

        manifest = [
          {
              "name": "Lolipops",
              "quantity": 1,
              "price": "100",
              "is_fragile": false
          },
          
          {
              "name": "Lolipops",
              "quantity": 2,
              "price": "100",
              "is_fragile": false
          }
        ];
        
        pickup_windows = [
          {
              "date": 1515024000,
              "start": "10 AM",
              "end": "12 PM"
          },
          {
              "date": 1569274000,
              "start": "7 AM",
              "end": "9 PM"
          }
        ]
        
        order = {
          "id":"d4cec98c-fac1-4a79-9880-9c056df013f5",
          "order_id":"d4cec98c-fac1-4a79-9880-9c056df013f5",
          "sender_name":"Jane Doe",
          "recipient_name:"John Rockerfeller",
          "pickup_code":"F8D957D6",
          "delivery_code":"1F3A9",
          "transaction_ref":"oabbjrb376sg6ioa8aor",
          "pikup_instruction":"Pickup package from security man",
          "delivery_instruction":"Drop off at the recipient",
          "champion_id":"663e8d8f-7cc8-4697-804b-7a6c934644d9"
        }
        
        SNIPPET:::END */
        
        this.httpClientBaseOptions = {
            baseUrl:(this.environment === "development"? api_base.sandbox : api_base.live), 
            headers: {
                'Authorization':apiKey
            }
        };
        
        this.httpBaseClient = got
    }
 
}

for(let methodName in apiEndpoints){
    if(apiEndpoints.hasOwnProperty(methodName)){
        MaxNgAPI.prototype[methodName] = makeMethod(apiEndpoints[methodName])
    }
}

module.exports = MaxNgAPI
