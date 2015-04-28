/**
 * The validate_doc_update function to be exported from the design doc.
 */

var types = require('couchtypes/types'),
    app_types = require('./types');

module.exports = function(newDoc, oldDoc, userCtx) {
    var restricted = ["TAPIRWIKISETTINGS", "NewPage"];
    for (i in restricted) {
        if (newDoc._id && newDoc._id == restricted[i]) throw ({
            forbidden: "Restricted _id: " + restricted[i] + ". Not allowed to modify."
        });
    }
    types.validate_doc_update(app_types, newDoc, oldDoc, userCtx);
};
