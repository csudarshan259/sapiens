#!/usr/bin/env node


const yargs = require("yargs");
const {addPerson,editPerson,deletePerson,searchPerson,listPeople} = require('./src/person');
const {addressGeneric} = require('./src/address');

// console.log("Hello To Sapiens");

const args = yargs.usage("person [command] [command-options] [arguments]")
    .command(
        `view`,
        `Display list of all people.`,
        (yargs) => {
            yargs.option(
                "i", {
                alias: "id",
                description: "Display particular person by id",
                demandOption: false,
                type: "number"
            }

            )
        },
        (opts) => listPeople(opts)
    )
    .command(
        `add`,
        `Add record of a new person.`,
        (yargs) => {
            yargs.option(
                "f", {
                alias: "firstname",
                description: "First name",
                demandOption: true,
                type: "string"
            }

            ).option(
                "l", {
                alias: "lastname",
                description: "Last name",
                demandOption: true,
                type: "string"
            }
            ).option(
                "d",
                {
                    alias: "dob",
                    description: "Date of birth in dd/mm/yyyy format",
                    demandOption: true,
                    type: "dd/mm/yyyy"
                }
            ).option(
                "n",
                {
                    alias: "nickname",
                    description: "Nickname",
                    demandOption: false,
                    type: "string"
                }
            )
        },
        (opts) => addPerson(opts)
    ).command(
        `edit`,
        `Edit/Update details of a particular person.`,
        (yargs) => {

            yargs.option(
                "i", {
                alias: "id",
                description: "Person's unique id",
                demandOption: true,
                type:"number"
            }

            ).option(
                "f", {
                alias: "firstname",
                description: "First name",
                demandOption: false,
                type: "string"
            }
            ).
                option(
                    "l", {
                    alias: "lastname",
                    description: "Last name",
                    demandOption: false,
                    type: "string"
                }
                ).option(
                    "d",
                    {
                        alias: "dob",
                        description: "Date of birth in dd/mm/yyyy format",
                        demandOption: false,
                        type: "dd/mm/yyyy"
                    }
                ).option(
                    "n",
                    {
                        alias: "nickname",
                        description: "Nickname",
                        demandOption: false,
                        type: "string"
                    }
                )
                .check((yargs)=>{
                    // console.log(yargs);
                    if(yargs.d != undefined || yargs.f != undefined || yargs.l !=undefined || yargs.n != undefined){
                        return true;
                    }
                    else {throw (new Error("Please select atleast one option (f,l,d,n)"));}

                });
        },
        (opts) => editPerson(opts)
    )
    .command(
        `delete`,
        `Delete a person.`,
        (yargs) => {
            yargs.option("i", {
                alias: "id",
                description: "Person's unique id",
                demandOption: true,
                type: "number"
            })
        },
        (opts) => deletePerson(opts)
    ).command(`search <search_input>`,
        `Search all people based on first and last name`, (yargs)=>{
                yargs.positional('search_input', {
                //  describe: 'Search',
                 type: 'string'
                })
        }, (opts) => (searchPerson(opts)))
    .command(`address [operation]`,
        `Address related operations. For more details see examples or use "person address --help" in command prompt`, (yargs)=>{
            yargs.positional('add',{
                describe:'Adds new address of a person',
                type:"string",
            }).positional('edit',{
                describe:'Edits an address',
                type:"string"
            }).positional('delete',{
                describe:'Deletes an address',
                type:"string"
            }).option('i',{
                alias:'id',
                description: "Address' unique id",
                demandOption: false,
                type:"number"
            }).option('pid',{
                alias:'personId',
                description: "Person's unique id",
                demandOption: false,
                type:"number"
            }).option(
                'l1',
                {
                    alias:"line1",
                    description: "Address line 1 (Required)",
                    demandOption:false,
                    type: "string"
                }
            ).option(
                'l2',
                {
                    alias:"line2",
                    description: "Address line 2",
                    demandOption:false,
                    type: "string"
                }
            ).option(
                'ctr',
                {
                    alias:"country",
                    description: "Country they live in",
                    demandOption:false,
                    type: "string"
                }
            ).option(
                'pc',
                {
                    alias:"postcode",
                    description: "Postal code of address",
                    demandOption:false,
                    type: "string"
                }
            ).check((yargs)=>{
                // console.log(yargs);
                if(yargs.operation == undefined){
                    throw (new Error(`Please select one operation (add/edit/delete)`));
                }
                if(yargs.operation=="add" && yargs.i != undefined && yargs.l1 != undefined){
                    return true;
                }
                else if(yargs.operation =="add" && yargs.pid == undefined && yargs.l1 == undefined) {
                    throw (new Error(`line1 and personId option is required while adding new address`));
                }
                if(yargs.operation =="edit"){
                if(yargs.i != undefined && (yargs.l1 != undefined||yargs.l2 !=undefined || yargs.ctr !=undefined || yargs.pc != undefined)){
                    return true;
                }
                else {
                    throw (new Error(`One more option is required along with id while editing an address`));
                }
            }
            if(yargs.operation == "delete"){

                if(yargs.i != undefined){

                }else{
                    throw (new Error(`id option is required while deleting address`));
                }
            }


                return true;
            });
        }, (opts) => (addressGeneric(opts))
    )

    .example(`$0 view`, `Lists all people.\n`)
    .example(`$0 add --firstname "Bob" --lastname "Smith" --dob 10/03/1960`, `Creates a new person record with mandatory parameters with first name as "Bob", last name as "Smith" and date of birth as "10/03/1960".\n`)
    .example(`$0 add --firstname "Susan" --lastname "Delgato" --dob 01/05/1970 --nickname "Susie"`, `Creates a new person record with mandatory parameters with first name as "Susan", last name as "Delgato", date of birth as "01/05/1971" and an optional parameter nickname as "Susie".\n`)
    .example(`$0 edit --id 3 --lastname "Patel"`, `Edits the last name of a person with id 3 to "Patel"".\n`)
    .example(`$0 delete --id 3`, `Deletes a person having person identifier as 3.\n`)
    .example(`$0 search "abc"`, `Searches all people containing "abc" in their first name or last name".\n`)
    .example(`$0 view --id 3`, `Returns a single person record with id 3.\n`)
    .example(`$0 address add --personId 3 --line1 "123 Evergreen Terrace" --country "Denmark"`, `Adds address of the person having person id as 3 and mandatory parameter as line1.\n`)
    .example(`$0 address edit --id 9 --line2 "Strand"`, `Updates line2 of address having address id as 9.\n`)
    .example(`$0 address delete --id 9`, `Deletes an address with id as 9.\n`)
    .wrap(120)
    .recommendCommands()
    .epilogue(`For option alias and other details, type "<command> --help", example person add --help`)
    .help()
    .strict().demandCommand(1, "");

args.argv;
