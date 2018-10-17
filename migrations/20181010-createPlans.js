import fs from 'fs';
import uuid from 'uuidv4';
import blessed from 'blessed';
module.exports = {
    up: (queryInterface) => {     
        // eslint-disable-next-line  
        return new Promise((resolve, reject) => {
            /**
             * Better solution would be to create a data stream or event emmiter
             * and drain it to the database
             * but at the moment simple promise recursion would be sufficient
             * and bulk inserts it
             */
            let plan = fs.readFileSync('./migrations/k.p5d'); //maybe
            // Also possible to make it dynamic (self-adjusting) based on perfomace of batch size / insertion time 
            let batchSize = 100; 
            let requiredInsertions = 1000
            let count = 0
            let screen = blessed.screen({
                autopad: true,
                smartCSR: true,
            });
            console.log('This may take a while')
            let bar = blessed.progressbar({
                parent: screen,
                border: 'line',
                ch: ':',
                width: '50%',
                height: 3,
                top: 3,
                left: 3,
              })
            screen.append(bar);
            screen.render();

            let insert = (plans, count) => {
                return queryInterface.bulkInsert('Plans', plans)
                .then(() => {
                    count = count + batchSize
                    adjustProgressbar(count)
                    if(count >= requiredInsertions) {
                        return resolve('ok')
                        screen.destroy()
                    } else {
                        return recurse(count)
                    }
                }).catch((error) => {
                    screen.destroy()
                    console.log(error);
                    return reject()
                })
            }
            let adjustProgressbar = (count) => {
                let proggress = Math.floor((count / requiredInsertions) * 100)
                bar.setProgress(proggress)
                screen.render();
            }
            let recurse = (count) => {
                return insert(getPlans(), count)
            }

            let getPlans = () => {
                let plans = []
                for(let i=0; i<=batchSize; i++) {
                    plans.push({
                    name: uuid(),
                    plan: JSON.stringify(JSON.parse(plan))
                    })
                }
                return plans
                }
            recurse(count)
        }) 
    },

    down: function(query) {
        return query.dropTable('plans');
    }
};