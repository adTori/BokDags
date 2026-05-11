'use strict';

/**
 * saved-book service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::saved-book.saved-book');
