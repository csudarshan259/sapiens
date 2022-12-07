
const fs = require('fs');
const { isEmpty } = require('./validation');
const persistence = './persistence/';
const person = 'person.json';
const pid = 'pid.json';
const person_address = 'person_address';
function listPeople(options) {
    console.log(options);
}
function updatePidFile(incrementValue) {
    const obj = { counter: incrementValue };
    fs.writeFileSync(persistence + pid, JSON.stringify(obj));
    return;
}
function addPerson(options) {
    // console.log(options)
    try {
        // Note that jsonString will be a <Buffer> since we did not specify an
        // encoding type for the file. But it'll still work because JSON.parse() will
        // use <Buffer>.toString().
        const jsonString = fs.readFileSync(persistence + person);
        const personObj = JSON.parse(jsonString);




        const incrementer = fs.readFileSync(persistence + pid);
        const oldId = JSON.parse(incrementer);
        const newId = oldId.counter + 1;
        updatePidFile(newId);

        const newObj = {
            id: newId,
            firstname: options.f,
            lastname: options.l,
            dateofbirth: options.dob,
            nickname: options.n != undefined ? options.n : ""
        }
        personObj.push(newObj);
        fs.writeFileSync(persistence + person, JSON.stringify(personObj));
        console.log("Person added successfully");
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
            console.log("No data found with the given id.");
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
        let index = personObj.findIndex((v) => v.id === options.id);

        personObj[index] = newObj;
        fs.writeFileSync(persistence + person, JSON.stringify(personObj));
        // console.log(personObj);
        // console.log(options);
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
            console.log("No data found with the given id.");
            return;
        }
        personObj.splice(index, 1);

        // //print result
        // console.log(personObj);
        // console.log(options);
        fs.writeFileSync(persistence + person, JSON.stringify(personObj));
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

        const filteredResult = personObj.find((p) => p.firstname.includes(options.search_input) || p.lastname.includes(options.search_input) );

        console.table(filteredResult);

    } catch (err) {
        console.log(err);
        return;
    }
}
function viewSinglePerson(options) {
    console.log(options)
}

module.exports = {
    addPerson,
    editPerson,
    deletePerson,
    searchPerson,
    viewSinglePerson
}
