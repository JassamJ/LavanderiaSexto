/**
 * @typedef {Object} IService
 * @property {string} name
 * @property {number} quantity
 * @property {number} unitPrice
 */

/**
 * @typedef {Object} IGarments
 * @property {string} type
 * @property {string} description
 * @property {string} observations
 * @property {IService[]} services
 */

/**
 * @typedef {Object} IOrder
 * @property {number} [id]
 * @property {number} client_id
 * @property {number} user_id
 * @property {Date|string} [created_at]
 * @property {Date|string} [estimated_delivery_date]
 * @property {Date|string} [real_delivery_date]
 * @property {string} state
 * @property {number} total
 * @property {boolean} pagado
 * @property {IGarments[]} [garments]
 */

