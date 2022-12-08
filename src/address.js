
const fs = require('fs');
const { isEmpty, duplicateAddress,checkPid } = require('./validation');
const {persistence,address,person_address,aid} = require('../constants');
function updateAidFile(incrementValue) {
    const obj = { counter: incrementValue };
    fs.writeFileSync(persistence + aid, JSON.stringify(obj));
    return;
}
function addressGeneric(options) {
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
    }
    // console.log(options);
}
function createAddress(options) {
    try {
        // Note that jsonString will be a <Buffer> since we did not specify an
        // encoding type for the file. But it'll still work because JSON.parse() will
        // use <Buffer>.toString().
        const jsonString = fs.readFileSync(persistence + address);
        const addressObj = JSON.parse(jsonString);

        const incrementer = fs.readFileSync(persistence + aid);
        const oldId = JSON.parse(incrementer);
        const newId = oldId.counter + 1;

        const newObj = {
            id: newId,
            line1: options.line1,
            line2: options.line2 != undefined ? options.line2 : "",
            country: options.country != undefined ? options.country : "",
            postcode: options.pc != undefined ? options.pc : ""
        }
        if (duplicateAddress(options.personId,addressObj, newObj, "add",oldId.counter)) {
            return;
        }
        if(!checkPid(options.personId)){
            return;
        }
        updateAidFile(newId);
        addressObj.push(newObj);
        fs.writeFileSync(persistence + address, JSON.stringify(addressObj));

        const paString = fs.readFileSync(persistence + person_address);
        const paObj = JSON.parse(paString);
        const person_addressObj = {
            personId: options.personId,
            addressId: newId
        }
        paObj.push(person_addressObj);
        fs.writeFileSync(persistence + person_address, JSON.stringify(paObj));
        console.log("Address added successfully");
    } catch (err) {
        console.log(err);
        return;
    }

    console.log(options)
}
function editAddress(options) {
    try {

        const jsonString = fs.readFileSync(persistence + address);
        const addressObj = JSON.parse(jsonString);
        if (isEmpty(addressObj, "person")) {
            return;
        }
        const addressToUpdate = addressObj.find(x => x.id == options.id);
        if (addressToUpdate == undefined) {
            console.log("No data found for the given id.");
            return;
        }
        const newObj = {
            id: options.id,
            line1: options.line1 != undefined ? options.line1 : addressToUpdate.line1,
            line2: options.line2 != undefined ? options.line2 : addressToUpdate.line2,
            country: options.country != undefined ? options.country : addressToUpdate.country,
            postcode: options.postcode != undefined ? options.postcode : addressToUpdate.postcode
        }
        if (duplicateAddress(null,addressObj, newObj, "edit")) {
            return;
        }
        const index = addressObj.findIndex((v) => v.id === options.id);

        addressObj[index] = newObj;
        fs.writeFileSync(persistence + address, JSON.stringify(addressObj));
        // console.log(personObj);
        // console.log(options);
        console.log("Address updated successfully.");
    } catch (err) {
        console.log(err);
        return;
    }


}
function deleteAddress(options) {
    console.log(options)
}
// function searchAddress(options){
//     console.log(options)
// }
// function viewSingleAddress(options){
//     console.log(options)
// }
module.exports = {
    addressGeneric,
    createAddress,
    editAddress,
    deleteAddress
}
