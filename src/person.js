const fs = require('fs');
const { isEmpty, duplicatePerson, dobValidation, propertiesEmtpyForPerson, hasNumber, duplicatePersonEdit, createIfNotExist, sanitizeString } = require('./validation');
const { persistence, person, person_address, pid, address } = require('../constants');

function listPeople(options) {
    createIfNotExist();
    if (options.id != undefined) {
        viewSinglePerson(options);
        return;
    }
    const jsonString = fs.readFileSync(persistence + person);
    const personObj = JSON.parse(jsonString);
    if(isEmpty(personObj,"person data")){
        return;
    }
    console.table(personObj);
}
function updatePidFile(incrementValue) {
    createIfNotExist();
    const obj = { counter: incrementValue };
    fs.writeFileSync(persistence + pid, JSON.stringify(obj));
    return;
}

function addPerson(options) {
    try {
        createIfNotExist();
        const jsonString = fs.readFileSync(persistence + person);
        const personObj = JSON.parse(jsonString);
   

        const incrementer = fs.readFileSync(persistence + pid);
        const oldId = JSON.parse(incrementer);
        const newId = oldId.counter + 1;
        

        let newObj = {
            id: newId,
            firstname: options.f,
            lastname: options.l,
            dateofbirth: options.dob,
            nickname: options.n != undefined ? options.n : ""
        }
         newObj = JSON.parse(sanitizeString(JSON.stringify(newObj)));
         if(propertiesEmtpyForPerson(newObj)){
            return;
        }
        if (!dobValidation(newObj.dateofbirth) ) {
            return;
        }
        if(hasNumber(newObj.firstname) || hasNumber(newObj.lastname) || hasNumber(newObj.nickname) ){
            console.log("First name, last name and nickname cannot contain numbers");
            return;
        }
        if (duplicatePerson(personObj, newObj, "add")) {
            return;
        }
        updatePidFile(newId);

        personObj.push(newObj);
        fs.writeFileSync(persistence + person, sanitizeString(JSON.stringify(personObj)));
        console.log(`Person added successfully. New person id is ${newId}`);
    } catch (err) {
        console.log(err);
        return;
    }
}
function editPerson(options) {
    try {
        createIfNotExist();
        const jsonString = fs.readFileSync(persistence + person);
        const personObj = JSON.parse(sanitizeString(jsonString.toString()));
        if (isEmpty(personObj, "person data")) {
            return;
        }
        const personToUpdate = personObj.find(x => x.id == options.id);
        if (personToUpdate == undefined) {
            console.log("No data found for the given id.");
            return;
        }
        let newObj = {
            id: options.id,
            firstname: options.f != undefined ? options.f : personToUpdate.firstname,
            lastname: options.l != undefined ? options.l : personToUpdate.lastname,
            dateofbirth: options.d != undefined ? options.d : personToUpdate.dateofbirth,
            nickname: options.n != undefined ? options.n : personToUpdate.nickname
        }
        newObj = JSON.parse(sanitizeString(JSON.stringify(newObj)));
        if(propertiesEmtpyForPerson(newObj)){
            return;
        }
         if (!dobValidation(newObj.dateofbirth) ) {
            return;
        }
        if(hasNumber(newObj.firstname) || hasNumber(newObj.lastname) || hasNumber(newObj.nickname) ){
            console.log("First name, last name and nickname cannot contain numbers");
            return;
        }
        if (duplicatePersonEdit(personObj, newObj, "edit")) {
            return;
        }
        let index = personObj.findIndex((v) => v.id === options.id);

        personObj[index] = newObj;
        fs.writeFileSync(persistence + person,sanitizeString(JSON.stringify(personObj)));

        console.log("Person updated successfully.");
    } catch (err) {
        console.log(err);
        return;
    }
}

function deletePerson(options) {
    try {
        createIfNotExist();
        const jsonString = fs.readFileSync(persistence + person);
        const personObj = JSON.parse(jsonString);
        if (isEmpty(personObj, "person data")) {

            return;
        }
        const index = personObj.findIndex(p => p.id == options.id);
        if (index == -1) {
            console.log("No data found for the given id.");
            return;
        }
        personObj.splice(index, 1);
        fs.writeFileSync(persistence + person, JSON.stringify(personObj)); //delete from person.json

        const personAddressJsonString = fs.readFileSync(persistence + person_address);
        let personAddressObj = JSON.parse(personAddressJsonString);

        const personAddress = personAddressObj.find(p => p.personId == options.id);

        const personAddressIndex = personAddressObj.findIndex((v) => v.personId === options.id);

        if (personAddressIndex == -1) {
        } else {

            personAddressObj = personAddressObj.filter(function (pao) {
                return pao.personId != personAddress.personId;
            });

            fs.writeFileSync(persistence + person_address, JSON.stringify(personAddressObj)); //delete from person_address.json

        }

        console.log("Person removed successfully.");
    } catch (err) {
        console.log(err);
        return;
    }
}
function searchPerson(options) {
    try {
createIfNotExist();
        const jsonString = fs.readFileSync(persistence + person);
        const personObj = JSON.parse(jsonString);
        if (isEmpty(personObj, "person data")) {
            return;
        }

        const filteredResult = personObj.filter((p) => p.firstname.toString().toLowerCase().includes(options.search_input.toString().toLowerCase()) || p.lastname.toString().toLowerCase().includes(options.search_input.toString().toLowerCase()));
        if(filteredResult.length !=0)
        console.table(filteredResult);
        else{
            console.log("No match found");
        }

    } catch (err) {
        console.log(err);
        return;
    }
}
function viewSinglePerson(options) {
createIfNotExist();
    const jsonString = fs.readFileSync(persistence + person);
    const personObj = JSON.parse(jsonString);
    if (isEmpty(personObj, "person data")) {
        return;
    }
    const singlePerson = personObj.filter((v) => v.id == options.id);
    const addressString = fs.readFileSync(persistence + address);
    const addressObj = JSON.parse(addressString);
    const personAddressString = fs.readFileSync(persistence + person_address);
    const personAddressObj = JSON.parse(personAddressString);
    var pao = [];

    var addr = [];
    var custobj = [];


    const paotemp = personAddressObj.filter((pa) => pa.personId == options.id);
    pao.push(paotemp);
    pao.forEach((paoi) => {
        paoi.forEach(element => {
            const addrtemp = addressObj.filter((a) => a.id == element.addressId);
            addr.push(addrtemp);

        });
    });

    if (singlePerson.length !=0 ) {
        console.table(singlePerson);
        addr.forEach(addrtemp => {
            console.table(addrtemp);
        })
        return;
    }
    console.log("No data found for the given id.")
}

module.exports = {
    listPeople,
    addPerson,
    editPerson,
    deletePerson,
    searchPerson
}
