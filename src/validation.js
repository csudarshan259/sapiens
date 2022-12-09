const { persistence, person, person_address } = require('../constants');
const fs = require('fs');
const { default: axios } = require('axios');
function hasNumber(value) {
    var isDigit = /\d/;
    return isDigit.test(value);
}
function isEmpty(arr, type) {
    if (arr && arr.length) {
        return false;
    }
    else {
        console.log(`No ${type} present.`);
        return true;
    }

}
function checkPid(personId) {
    const jsonString = fs.readFileSync(persistence + person);
    const personObj = JSON.parse(jsonString);
    const index = personObj.findIndex(p => p.id == personId);
    if (index == -1) {
        console.log("No person data found for the given id.");
        return false;
    }
    return true;
}
function duplicatePerson(personObj, newPersonObj, type) {

    const existingPerson = personObj.find(x => x.firstname.toString().toLowerCase() == newPersonObj.firstname.toString().toLowerCase() &&
        x.lastname.toString().toLowerCase() == newPersonObj.lastname.toString().toLowerCase());
    if (existingPerson == undefined) {
        return false;
    }
    console.log(`Could not ${type}. Person with given first name and last name exists already.`);

    return true;
}
function duplicatePersonEdit(personObj, newPersonObj, type) {

    const existingPerson = personObj.find(x => x.firstname.toString().toLowerCase() == newPersonObj.firstname.toString().toLowerCase()
        && x.lastname.toString().toLowerCase() == newPersonObj.lastname.toString().toLowerCase()
        && x.dateofbirth.toString() == newPersonObj.dateofbirth.toString()
        && x.nickname.toString().toLowerCase() == newPersonObj.nickname.toString().toLowerCase());
    if (existingPerson == undefined) {
        return false;
    }
    console.log(`Could not ${type}. Person already contains same values.`);

    return true;
}
function duplicateAddress(personId, addressObj, newAddressObj, type) {

    const newAddressLine1 = newAddressObj.line1 ? newAddressObj.line1 : "";
    const newAddressLine2 = newAddressObj.line2 ? newAddressObj.line2 : "";
    const newAddressCountry = newAddressObj.country ? newAddressObj.country : "";
    const newAddressPostCode = newAddressObj.postcode ? newAddressObj.postcode : "";
    const existingAddress = addressObj.find(x => x.line1.toString().toLowerCase() == newAddressLine1.toString().toLowerCase() &&
        x.line2.toString().toLowerCase() == newAddressLine2.toLowerCase() &&
        x.country.toString().toLowerCase() == newAddressCountry.toString().toLowerCase() &&
        x.postcode.toString().toLowerCase() == newAddressPostCode.toString().toLowerCase());

    if (existingAddress == undefined) {
        return false;
    }
    if (type == "add") {
        const personAddressJsonString = fs.readFileSync(persistence + person_address);
        const personAddressObj = JSON.parse(personAddressJsonString);

        const existingPersonAddressObj = personAddressObj.find(obj => obj.addressId == existingAddress.id && obj.personId == personId);

        if (existingAddress != undefined && (existingPersonAddressObj != undefined)) {
            console.log(`Could not ${type}. Address exists already.`);
            return true;
        }
        if (existingAddress != undefined) {
            const paString = fs.readFileSync(persistence + person_address);
            const paObj = JSON.parse(paString);
            const person_addressObj = {
                personId: personId,
                addressId: existingAddress.id
            };


            paObj.push(person_addressObj);
            fs.writeFileSync(persistence + person_address, JSON.stringify(paObj));
            console.log(`Existing address with personId ${personId} and address id ${person_addressObj.addressId} added successfully.`);
            return true;
        }
    }


    console.log(`Could not ${type}. Address exists already.`);

    return true;
}
function dobValidation(dob) {
    const data = dob.toString().split("/");

    if (data.length - 1 == 2) {
    } else {
        console.log("Date of birth should be in dd/mm/yyyy format.");
        return false;
    }

        if(data[0]==''||data[1]==''||data[2]==''){

            console.log("Please provide valid date.");
            return false;
        }
        if(parseInt(data[0])>=1 && parseInt(data[0]) <=31 && parseInt(data[1])>=1 && parseInt(data[1])<=12 ){

        }else{
            console.log("Please provide vaild date");
            return false;
        }
        if(data[0].length != 2 || data[1].length !=2 || data[2].length != 4){
            console.log("Please provide valid date.");
            return false;
        }
        if(isNaN(data[0]) || isNaN(data[1]) || isNaN(data[2]))
        {
            console.log("Please provide valid date.");
            return false;
        }

    return true;
}
async function isEuropeanCountry(country) {
    let count = 0;
    let countryPresent = await axios.get('https://restcountries.com/v2/region/europe').then(async res => {
        const temp = res.data.find(x => x.name.toString().toLowerCase() == country);
        return await temp;
    }).catch(err => {
        count += 1;
        console.log("Something went wrong. Kindly check device internet connection.");
    });

    if (countryPresent) {
        return true;
    }
    if (count != 1)
        console.log("Country should be from Europe.");
    return false;

}
function propertiesEmtpy(options,type){
    const newAddressLine1 = options.line1 != undefined && options.line1.length >=0? options.line1 : undefined;
    if(newAddressLine1 == ""){
        console.log("Mandatory address field like line1 cannot be empty while adding or editing.");
        return true;
    }
    return false;
}
function propertiesEmtpyForPerson(options){
    const firstname = options.firstname ? options.firstname : "";
    const lastname = options.lastname ? options.lastname : "";
    let dob = options.dateofbirth ? options.dateofbirth : "";
    if(dob == ""){
        dob = options.dob ? options.dob : "";
    }
    if(firstname =="" || lastname == "" || dob ==""){
        console.log("Mandatory fields like first name, last name or date of birth cannot be empty while adding or editing.");
        return true;
    }
    return false;
}
module.exports = {
    isEmpty,
    duplicatePerson,
    duplicatePersonEdit,
    dobValidation,
    duplicateAddress,
    checkPid,
    isEuropeanCountry,
    hasNumber,
    propertiesEmtpy,
    propertiesEmtpyForPerson
}
