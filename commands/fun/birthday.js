const fs = require('fs');

module.exports = {
    name: 'birthday',
    description: 'Returns latency and API ping',
    aliases: ['bday', 'bd'],
    run: async (client, message, args) => {
        let obj = [[]];

        fs.exists('./birthdays.json', (exists) => {
            if(!exists) {
                obj.push({ name: args[0], birthday: args[1], age: args[2] });
                const json = JSON.stringify(obj, null, '\t');
                console.log(json);

                fs.writeFile('birthdays.json', json, 'utf8', function(err) {
                    if(err) {
                        return console.log(err);
                    }

                    return console.log('File successfully made!');
                });
            } else {
                fs.readFile('birthdays.json', 'utf8', function readFileCallback(error, data) {
                    obj = JSON.parse(data);
                    obj.table.push({ birthday: args[1], age: args[2] });
                    const json = JSON.stringify(obj);

                    fs.writeFile('birthdays.json', json, 'utf8', function(err) {
                        if(err) {
                            return console.log(err);
                        }

                        console.log('File successfully updated!');
                    });
                });
            }
        });
    },
};