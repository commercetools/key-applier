import dotenv from 'dotenv';
import { getBearerToken, makeAPIRequests } from './functions.js';
dotenv.config();

// Environment variables
const CTP_PROJECT_KEY = process.env.CTP_PROJECT_KEY;
const CTP_API_URL = process.env.CTP_API_URL;

// Console input starts
console.clear();

// Contains the results of each query
let queryResults = [];

// Get the bearer token
const bearerToken = await getBearerToken();

// Categories need two calls:

// One call where Assets is not empty
// One call where key is not defined
// Merge the results into one logical unit
// Construct update actions based on key not being present, and Asset keys not being present
// Mass call to update
// Use this as the basis for Products as well

try {
    queryResults = await makeAPIRequests([
        {
            url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/graphql`,
        options: {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `query{ categories(limit:500){ results{ id version key assets { id key }} }}`
            })
        }
        }
    ])
}
catch (error) {
    console.error('❌  An error occurred:', error);
}



const processedResults = queryResults.reduce((acc, item) => {
    const key = Object.keys(item)[0];
    acc = item[key].results;
    return acc;
}, {});

console.log(processedResults)

// Put the GraphQL response into a workable array
/*const processedResults = queryResults.reduce((acc, item) => {
    const key = Object.keys(item)[0];
    acc[key] = item[key].results;
    return acc;
}, {});*/

/*let keysAreNeeded = [];

// Loop through the selected resource types and display how many need keys
console.log("Results: ")
for (let i = 0; i < answers.selectedEndpoints.length; i++) {
    console.log(`${processedResults[answers.selectedEndpoints[i]].length} ${answers.selectedEndpoints[i]} need keys.`)
    if (processedResults[answers.selectedEndpoints[i]].length > 0) { keysAreNeeded.push(endpoints.indexOf(answers.selectedEndpoints[i])) }
}

console.log(processedResults)
console.log("---")

// Prompt user to update resources which need keys
if (keysAreNeeded.length > 0) {

    const choices = keysAreNeeded.map(index => endpoints[index]);
    const versions = 0

    const updateCalls = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'selectedEndpoints',
            message: 'Select the resources to apply keys to:',
            choices: keysAreNeeded.map(index => endpoints[index])
        }
    ]);

    try {

        for (let i = 0; i < keysAreNeeded.length; i++) {
            if (answers.selectedEndpoints.includes(endpoints[keysAreNeeded[i]])) {

                const updateCalls = [];

                for (let ii = 0; ii < processedResults[endpoints[keysAreNeeded[i]]].length; ii++) {
                    updateCalls.push({
                        url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/graphql`,
                        options: {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${bearerToken}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                query: `mutation { ${postEndpoints[keysAreNeeded[i]]}(id: "${processedResults[endpoints[keysAreNeeded[i]]][ii].id}", version: ${processedResults[endpoints[keysAreNeeded[i]]][ii].version}, actions: [{setKey: {key: "${endpoints[keysAreNeeded[i]]}_${processedResults[endpoints[keysAreNeeded[i]]][ii].id}"}}]) { id }}`
                            })
                        }
                    })
                }

                await makeAPIRequests(updateCalls)
            }
        }
    }
    catch (error) {
        console.error('❌  An error occurred:', error);
    }

    console.log("---")
    console.log("Finished");
}*/