const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const util = require('./utility/util')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json({ limit: '10mb' }))


app.get("/", (req, res)=>{
  res.status(200).send("Welcome To Data Processor Server")
})

let processData = (req, res) =>{
  if(!req.body.hasOwnProperty("data")){
    return res.status(400).json({"err": "Bad Request", "msg": "Required parameter missing" })
  }
  try{
    let rxdData = req.body.data
    let payload = rxdData["payload"];
    let refData = rxdData["referenceData"]
    let refKeys = Object.keys(refData)
    let result = util.processPayload(payload, refData, refKeys)
    return res.status(200).json(result )
  } catch(err){
    //Use std logger like winston and log to file
    console.log("Internal Server Error", err)
    return res.status(500).json({"err":"Internal Server Error"})
  }
 
}


app.post("/api/processdata", processData);
let port = process.env.port || '8080'
app.listen(`${port}`, ()=>{
	console.log("[ Data Processor Server Listening on port  ]", `${port}`);
})
