
const fs = require('fs');
const { isEmpty, duplicateAddress, checkPid,isEuropeanCountry,propertiesEmtpy, createIfNotExist, sanitizeString, hasNumber } = require('./validation');
const { persistence, address, person_address, aid } = require('../constants');
function updateAidFile(incrementValue) {
    createIfNotExist();
    const obj = { counter: incrementValue };
    fs.writeFileSync(persistence + aid, JSON.stringify(obj));
    return;
}
function addressGeneric(options) {
    createIfNotExist();
    switch (options.operation) {
        case 'add':
            createAddress(options)
            break;
        case 'edit':
            editAddress(options)
            break;
        case 'delete':
            deleteAddress(options)
            break;
        default:
            console.log("Only add, edit, delete operations are allowed f");
            break;
    }
}
async function createAddress(options) {
    try {
        const jsonString = fs.readFileSync(persistence + address);
        const addressObj = JSON.parse(sanitizeString(jsonString));

        const incrementer = fs.readFileSync(persistence + aid);
        const oldId = JSON.parse(incrementer);
        const newId = oldId.counter + 1;
        if(options.i != undefined){
            console.log("Cannot take address id parameter while adding new address");
            return;
        }
        let newObj = {
            id: newId,
            line1: options.line1,
            line2: options.line2 != undefined ? options.line2 : "",
            country: options.country != undefined ? options.country : "",
            postcode: options.pc != undefined ? options.pc : ""
        }
        newObj = JSON.parse(sanitizeString(JSON.stringify(newObj)));
        if(propertiesEmtpy(newObj,"add")){
            return;
        }
        if(newObj.line2 !="" && hasNumber(newObj.line2)){
            console.log("line2 cannot contain numbers");
            return;
        }
        if(isNaN(newObj.postcode)){
            console.log("Postal code cannot contain special symbols or characters");
            return;
        }

        if (!checkPid(options.personId)) {
            return;
        }
        if (duplicateAddress(options.personId, addressObj, newObj, "add")) {
            return;
        }
        if(options.country != undefined && ! await isEuropeanCountry(options.country.toString().toLowerCase())){
            return;
        }
        updateAidFile(newId);
        addressObj.push(newObj);
        fs.writeFileSync(persistence + address,sanitizeString(JSON.stringify(addressObj)));

        const paString = fs.readFileSync(persistence + person_address);
        const paObj = JSON.parse(paString);
        const person_addressObj = {
            personId: options.personId,
            addressId: newId
        }
        paObj.push(person_addressObj);
        fs.writeFileSync(persistence + person_address, JSON.stringify(paObj));
        console.log(`Address added successfully with address id ${newId}`);
    } catch (err) {
        console.log(err);
        return;
    }
}
async function editAddress(options) {
    try {
        const jsonString = fs.readFileSync(persistence + address);
        const addressObj = JSON.parse(sanitizeString(jsonString));
        if (isEmpty(addressObj, "address")) {
            return;
        }
        

        const addressToUpdate = addressObj.find(x => x.id == options.id);
        if (addressToUpdate == undefined) {
            console.log("No data found for the given id.");
            return;
        }
        let newObj = {
            id: options.id,
            line1: options.line1 != undefined ? options.line1 : addressToUpdate.line1,
            line2: options.line2 != undefined ? options.line2 : addressToUpdate.line2,
            country: options.country != undefined ? options.country : addressToUpdate.country,
            postcode: options.postcode != undefined ? options.postcode : addressToUpdate.postcode
        }
        newObj = JSON.parse(sanitizeString(JSON.stringify(newObj)));
        if(propertiesEmtpy(newObj)){
            return;
        }
        if(newObj.line2 !="" && hasNumber(newObj.line2)){
            console.log("line2 cannot contain numbers");
            return;
        }
        if(isNaN(newObj.postcode)){
            console.log("Postal code cannot contain special symbols or characters");
            return;
        }

        if (duplicateAddress(null, addressObj, newObj, "edit")) {
            return;
        }
        if(options.country != undefined && ! await isEuropeanCountry(newObj.country.toString().toLowerCase())){
            return;
        }
        const index = addressObj.findIndex((v) => v.id === options.id);

        addressObj[index] = newObj;
        fs.writeFileSync(persistence + address,sanitizeString(JSON.stringify(addressObj)));

        console.log("Address updated successfully.");
    } catch (err) {
        console.log(err);
        return;
    }


}
function deleteAddress(options) {
    try {
        const jsonString = fs.readFileSync(persistence + address);
        const addressObj = JSON.parse(jsonString);
        if (isEmpty(addressObj, "address")) {
            return;
        }
        const index = addressObj.findIndex(a => a.id == options.id);
        if (index == -1) {
            console.log("No data found for the given id.");
            return;
        }
        addressObj.splice(index, 1);
        fs.writeFileSync(persistence + address, JSON.stringify(addressObj)); //delete from address.json

        const personAddressJsonString = fs.readFileSync(persistence + person_address);
        let personAddressObj = JSON.parse(personAddressJsonString);

        const personAddress = personAddressObj.find(p => p.addressId == options.id);
        const personAddressIndex = personAddressObj.findIndex((v) => v.addressId === options.id);

        if (personAddressIndex == -1) {
        } else {

            personAddressObj = personAddressObj.filter(function (pao) {
                return pao.addressId != personAddress.addressId;
            });
            fs.writeFileSync(persistence + person_address, JSON.stringify(personAddressObj)); //delete from person_address.json

        }
        console.log("Address removed successfully.");
    } catch (err) {
        console.log(err);
        return;
    }



}

module.exports = {
    addressGeneric,
    createAddress,
    editAddress,
    deleteAddress
}
