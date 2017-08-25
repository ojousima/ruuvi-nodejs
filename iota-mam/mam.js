const MAM = require('./iota-mam');
const mam_create = MAM.cwrap('mam_create', 'string', ['string','string','number','number','number','number','number','number']);
const mam_parse = MAM.cwrap('mam_parse', 'string', ['string', 'string', 'number']);

module.exports = {
  'mam_create': mam_create,
  'mam_parse': mam_parse
};

