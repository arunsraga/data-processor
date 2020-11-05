var express = require('express')
var bodyParser = require('body-parser')
// var _ = require('underscore')

var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get("/", (req, res)=>{
  res.status(200).send("Welcome To Data Processor Server")
})



let processPayload = (data, refData, refKeys)=>{
    for (var i=0; i<data.value.length; i++){
        console.log("[ iteration  ]", i)
        if(data.value[i].valueType == "string"){
            console.log("[ data.value[i].value ]", data.value[i].value)
            for(j=0; j<refKeys.length; j++){
              if(data.value[i].value.includes(refKeys[j])){
                    console.log(' refKeys[j] ' , refKeys[j])
                    console.log(' refData[refKeys[j]] ', refData[refKeys[j]])
                    console.log("[ Before repalce  ]", data.value[i].value)
                    data.value[i].value = data.value[i].value.replace("{"+ refKeys[j] +"}", refData[refKeys[j]])
                    console.log("[ After replace  ]", data.value[i].value)

               }
            }
        } else {
          processPayload(data.value[i], refData, refKeys)
        }
    }
    return data;
}


let processData = (req, res) =>{

  if(!req.body.hasOwnProperty("data")){
    return res.status(400).json({"err": "Bad Request", "msg": "Required parameter missing" })
  }

  let rxdData = req.body.data
  // processPayload(rxdData)

  var payload = rxdData["payload"];
  var refData = rxdData["referenceData"]
  var refKeys = Object.keys(refData)

  let result = processPayload(payload, refData, refKeys)

  res.json({ "status":"Success", result: result })
}


app.post("/api/processdata", processData);


let port = '8080'
app.listen(`${port}`, ()=>{
	console.log("[ Data Processor Server Listening on port  ]", `${port}`);
})
