
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
        updateAidFile(newId);

        const newObj = {
            id: newId,
            line1: options.line1,
            line2: options.line2 != undefined ? options.line2 : "",
            country: options.country != undefined ? options.country : "",
            postcode: options.pc != undefined ? options.pc : ""
        }
        if (duplicateAddress(addressObj, newObj, "add")) {
            return;
        }
        if(!checkPid(options.personId)){
            return;
        }
        addressObj.push(newObj);
        fs.writeFileSync(persistence + address, JSON.stringify(personObj));

        const person_addressObj = {
            personId: options.personId,
            addressId: newId
        }
        fs.writeFileSync(persistence + person_address, JSON.stringify(person_addressObj));
        console.log("Address added successfully");
    } catch (err) {
        console.log(err);
        return;
    }

    console.log(options)
}
function editAddress(options) {
    console.log(options)
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
