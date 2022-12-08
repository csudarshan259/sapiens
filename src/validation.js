

// function isEmpty(obj,type){
//     if( obj // 👈 null and undefined check
//     && Object.keys(obj).length === 0
//     && Object.getPrototypeOf(obj) === Object.prototype){
//         console.log(`No ${type} present`);
//         return true;
//     }
//     return false;
// }
const {persistence,person} = require('../constants');
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

function duplicateAddress(addressObj,newAddressObj,type){
    console.log(addressObj);
    const existingAddress = addressObj.find(x => x.line1.toString().toLowerCase() == newAddressObj.line1.toString().toLowerCase() &&
    x.line2.toString().toLowerCase() == newAddressObj.line2.toString().toLowerCase() &&
    x.country.toString().toLowerCase() == newAddressObj.country.toString().toLowerCase() &&
    x.postcode.toString().toLowerCase() && newAddressObj.postcode.toString().toLowerCase());
    if (existingAddress == undefined) {
        return false;
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
module.exports = {
    isEmpty,
    duplicatePerson,
    dobValidation,
    duplicateAddress,
    checkPid
}
