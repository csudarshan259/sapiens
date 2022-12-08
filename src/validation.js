

// function isEmpty(obj,type){
//     if( obj // 👈 null and undefined check
//     && Object.keys(obj).length === 0
//     && Object.getPrototypeOf(obj) === Object.prototype){
//         console.log(`No ${type} present`);
//         return true;
//     }
//     return false;
// }
const {persistence,person, person_address} = require('../constants');
const fs = require('fs');

function isEmpty(arr,type){
    if(arr && arr.length){
        return false;
    }
    else{
        console.log(`No ${type} present.`);
        return true;
    }

}

function checkPid(personId){
    const jsonString = fs.readFileSync(persistence + person);
        const personObj = JSON.parse(jsonString);
            const index = personObj.findIndex(p => p.id == personId);
            if (index == -1) {
                console.log("No person data found for the given id.");
                return false;
            }
            return true;
}
function duplicatePerson(personObj,newPersonObj,type){

    const existingPerson = personObj.find(x => x.firstname.toString().toLowerCase() == newPersonObj.firstname.toString().toLowerCase() && x.lastname.toString().toLowerCase() == newPersonObj.lastname.toString().toLowerCase());
    if (existingPerson == undefined) {
        return false;
    }
    console.log(`Could not ${type}. Person with given first name and last name exists already.`);

    return true;
}

function duplicateAddress(personId,addressObj,newAddressObj,type,oldId){



    const newAddressLine1 = newAddressObj.line1?newAddressObj.line1:"";
    const newAddressLine2 = newAddressObj.line2?newAddressObj.line2:"";
    const newAddressCountry = newAddressObj.country?newAddressObj.country:"";
    const newAddressPostCode = newAddressObj.postcode?newAddressObj.postcode:"";
    const existingAddress = addressObj.find(x => x.line1.toString().toLowerCase() == newAddressLine1.toString().toLowerCase() &&
     x.line2.toString().toLowerCase() == newAddressLine2.toLowerCase() &&
    x.country.toString().toLowerCase() == newAddressCountry.toString().toLowerCase() &&
    x.postcode.toString().toLowerCase() == newAddressPostCode.toString().toLowerCase());

    // console.log("console.log existing address",existingAddress);
    if (existingAddress == undefined) {
        return false;
    }
    if(type=="add"){
        const personAddressJsonString= fs.readFileSync(persistence+person_address);
        const personAddressObj = JSON.parse(personAddressJsonString);

        const existingPersonAddressObj = personAddressObj.find(obj=>obj.addressId ==existingAddress.id && obj.personId==personId);

        if(existingAddress != undefined && (existingPersonAddressObj != undefined)){
            console.log(`Could not ${type}. Address exists already.`);
            return true;
         }
        if(existingAddress != undefined){
        const paString = fs.readFileSync(persistence + person_address);
        const paObj = JSON.parse(paString);
        const person_addressObj = {
            personId: personId,
            addressId: existingAddress.id
        };


            paObj.push(person_addressObj);
            fs.writeFileSync(persistence + person_address, JSON.stringify(paObj));
            console.log(`Existing address with personId ${personId} added successfully.`);
            return true;
        }
    }


    console.log(`Could not ${type}. Address exists already.`);

    return true;
}
function dobValidation(dob){


        if( dob.toString().split('/').length - 1 ==2){
            return true;
        }
        console.log("Date of birth should be in dd/mm/yyyy format.");
        return false;

}
function isEuropeanCountry(country){
   fetch('https://restcountries.com/v3.1/region/europe').then(res=>{
    console.log(res);
   });

}
module.exports = {
    isEmpty,
    duplicatePerson,
    dobValidation,
    duplicateAddress,
    checkPid,
    isEuropeanCountry
}
