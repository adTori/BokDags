'use strict';

/**
 * sitesetting service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::sitesetting.sitesetting');
