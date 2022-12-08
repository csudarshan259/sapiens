const fs = require('fs');
const { isEmpty, duplicatePerson, dobValidation, isEuropeanCountry, hasNumber, duplicatePersonEdit } = require('./validation');
const { persistence, person, person_address, pid, address } = require('../constants');

function listPeople(options) {
    if (options.id != undefined) {
        viewSinglePerson(options);
        return;
    }
    const jsonString = fs.readFileSync(persistence + person);
    const personObj = JSON.parse(jsonString);
    console.table(personObj);
}
function updatePidFile(incrementValue) {
    const obj = { counter: incrementValue };
    fs.writeFileSync(persistence + pid, JSON.stringify(obj));
    return;
}
function addPerson(options) {
    try {
        const jsonString = fs.readFileSync(persistence + person);
        const personObj = JSON.parse(jsonString);
        const incrementer = fs.readFileSync(persistence + pid);
        const oldId = JSON.parse(incrementer);
        const newId = oldId.counter + 1;
        if (!dobValidation(options.dob) ) {
            return;
        }

        const newObj = {
            id: newId,
            firstname: options.f,
            lastname: options.l,
            dateofbirth: options.dob,
            nickname: options.n != undefined ? options.n : ""
        }
        if(hasNumber(newObj.firstname) || hasNumber(newObj.lastname) || hasNumber(newObj.nickname) ){
            console.log("First name, last name and nickname cannot contain numbers");
            return;
        }
        updatePidFile(newId);

        if (duplicatePerson(personObj, newObj, "add")) {
            return;
        }
        personObj.push(newObj);
        fs.writeFileSync(persistence + person, JSON.stringify(personObj));
        console.log(`Person added successfully. New person id is ${newId}`);
    } catch (err) {
        console.log(err);
        return;
    }
}
function editPerson(options) {
    try {
        const jsonString = fs.readFileSync(persistence + person);
        const personObj = JSON.parse(jsonString);
        if (isEmpty(personObj, "person")) {
            return;
        }
        const personToUpdate = personObj.find(x => x.id == options.id);
        if (personToUpdate == undefined) {
            console.log("No data found for the given id.");
            return;
        }
        // console.log(personToUpdate);
        const newObj = {
            id: options.id,
            firstname: options.f != undefined ? options.f : personToUpdate.firstname,
            lastname: options.l != undefined ? options.l : personToUpdate.lastname,
            dateofbirth: options.d != undefined ? options.d : personToUpdate.dateofbirth,
            nickname: options.n != undefined ? options.n : personToUpdate.nickname
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
        fs.writeFileSync(persistence + person, JSON.stringify(personObj));

        console.log("Person updated successfully.");
    } catch (err) {
        console.log(err);
        return;
    }
}

function deletePerson(options) {
    try {
        const jsonString = fs.readFileSync(persistence + person);
        const personObj = JSON.parse(jsonString);
        if (isEmpty(personObj, "person")) {
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
            // personAddressObj.splice(personAddressIndex,1);

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
        // console.log(options);
        const jsonString = fs.readFileSync(persistence + person);
        const personObj = JSON.parse(jsonString);
        if (isEmpty(personObj, "person")) {
            return;
        }

        const filteredResult = personObj.filter((p) => p.firstname.toString().toLowerCase().includes(options.search_input.toString().toLowerCase()) || p.lastname.toString().toLowerCase().includes(options.search_input.toString().toLowerCase()));
        if(filteredResult)
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
    const jsonString = fs.readFileSync(persistence + person);
    const personObj = JSON.parse(jsonString);
    if (isEmpty(personObj, "person")) {
        return;
    }
    const singlePerson = personObj.filter((v) => v.id == options.id);
    // console.log(singlePerson);

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
        // console.log(paoi)
        paoi.forEach(element => {
            const addrtemp = addressObj.filter((a) => a.id == element.addressId);
            // console.log(addrtemp)
            addr.push(addrtemp);

        });
    });
    // console.log(addr)
    // addr.forEach(addrtemp1 => {
    //     // console.log(addrtemp1);
    //     const customobj = {
    //         person:element,
    //         address:addrtemp1[0]
    //     }
    //     custobj.push(customobj);
    //     });
    // });

    if (singlePerson != undefined) {
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
