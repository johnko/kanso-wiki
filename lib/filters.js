/**
 * Filter functions to be exported from the design doc for _changes filtering.
 */

exports.pages = function(doc, req) {
    if (doc.type && doc.type === 'page') {
        return true;
    } else {
        return false;
    }
};
