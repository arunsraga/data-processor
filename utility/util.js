
/* 
* processPayload function. Replace all reference fields with 
* respective value from reference object
* arguments data : payload array
* refData : reference object 
* refKeys : reference object keys
*/
module.exports.processPayload = processPayload = (data, refData, refKeys)=>{
    for (var i=0; i<data.value.length; i++){
        if(data.value[i].valueType == "string"){
            for(j=0; j<refKeys.length; j++){
              if(data.value[i].value.includes(refKeys[j])){
                    data.value[i].value = data.value[i].value.replace("{"+ refKeys[j] +"}", refData[refKeys[j]])
               }
            }
        } else {
          processPayload(data.value[i], refData, refKeys)
        }
    }
    return data;
}
