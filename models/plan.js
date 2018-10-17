'use strict';
let Sequelize = require('sequelize');
module.exports = (sequelize) => {
  let Plan = sequelize.define('Plan', {
    name: { type: Sequelize.STRING },
    plan: { type: Sequelize.JSON },
    createdAt: { type: Sequelize.DATE, default: null},
    updatedAt: { type: Sequelize.DATE, default: null},
  },{
    indexes: [{
      fields: ['name']
    }]
  }
  );
  return Plan;
};