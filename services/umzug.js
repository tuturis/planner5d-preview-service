const Umzug = require('umzug');
import { sequelize } from '../models';

const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
        sequelize: sequelize,
    },

    // see: https://github.com/sequelize/umzug/issues/17
    migrations: {
        params: [
            sequelize.getQueryInterface(), // queryInterface
            sequelize.constructor, // DataTypes
            function() {
                throw new Error(
                    `Migration tried to use old style "done" callback.
                    Please upgrade to "umzug" and return a promise instead.`
                );
            }
        ],
        path: './migrations',
        pattern: /\.js$/
    },

    logging: function() {
        console.log.apply(null, arguments);
    },
});
module.exports = umzug
// import  * as Umzug  from  'umzug';
// import { sequelize } from '../models'

// let options = {
//     storage: 'sequelize',
//     storageOptions: {
//         sequelize: sequelize,
//     },
//     // see: https://github.com/sequelize/umzug/issues/17
//     migrations: {
//         params: [
//             sequelize.getQueryInterface(), // queryInterface
//             sequelize.constructor, // DataTypes
//             function() {
//                 throw new Error(
//                     `Migration tried to use old style "done" callback.
//                      Please upgrade to "umzug" and return a promise instead.`
//                 );
//             }
//         ],
//         path: './migrations',
//         pattern: /\.js$/
//     },
//     logging: function() {
//         console.log.apply(null, arguments);
//     },
// }
// class UmzugInstance extends Umzug {
//     constructor() {
//         super()
//     }

// }
// export default new UmzugInstance();
