 var AWS = require('aws-sdk');
 var fs = require("fs");
 var iot = new AWS.Iot({endpoint: "iot.us-east-1.amazonaws.com", accessKeyId: "", secretAccessKey: "", region: "us-east-1" });
 module.exports={
    createThing: function(thingName,csrLoc,certLoc, resultCallback){
      var thingArn="none";
      var callbackLocal= function(err){
        if(err){
          console.log(err);
          resultCallback(err,null);
        }else{
          resultCallback(null,thingArn);
        }
        
      };
      
      
      var csr = fs.readFileSync(csrLoc,"utf8");
      console.log(csr);
      createCertificate(csr).then((certArn)=>{
          
            console.log("CertArn"+certArn.certificateArn);
            createThingAWS(thingName)
            .then((retThingArn)=>{
                thingArn=retThingArn;
                console.log("ARNVar:"+thingArn);
                attachPrincipal(thingName,certArn.certificateArn)
                    doAssociatePolicy(certArn.certificateArn)
                      .then((data)=>{resultCallback(null,retThingArn);})
                      .catch(callbackLocal);
                })
                .catch(callbackLocal);
            })
            .catch(callbackLocal);
          
        
    }
  };
  var createCertificate=function(csr){
    var certParams ={
        certificateSigningRequest : csr,
        setAsActive: true
      };
      var certArn;
      return new Promise(function(fulfill,reject){
        iot.createCertificateFromCsr(certParams, function(err,data){
          if(err){
            reject(err);
          }else{
            console.log("Certifacte created "+data.certificateArn);
            fulfill(data.certificateArn);
          }
        });
      });
  };
  var createThingAWS= function(thingName){
    var params = {
      thingName: thingName,
      attributePayload: {merge: false}
    };
          
    return new Promise((fulfill,reject)=>{
      iot.createThing(params, function(err, data) {
        if (err) {
          reject(err);
                  // an error
        }else{
          fulfill(data.thingArn);
        }
      });
    });
  }
  var attachPrincipal=function(thingName,principal){
    var principalParam={
                thingName: thingName,
                principal: principal
              };
              return new Promise(function(fulfill,reject){
                iot.attachThingPrincipal(principalParam,  function(err,data){
                  if(err){
                    reject(err);
                  }else{
                    fulfill();
                  }   
                });
              });
  }
var treatPolicyResult= function(callback){
  return 
};
var doAssociatePolicy= function(principal){
       var policyParam={
                    policyName: "AutodiscoveryThingPolicy",
                    principal: principal
                  };
                  return new Promise(function (fulfill, reject){
                    iot.attachPrincipalPolicy(policyParam, function(err,data){
                      if(err){
                        reject(err);
                      }else{
                        console.log("Policy successfully attached");
                        fulfill(null);
                      }
                    });
                  });
};

