/**
 * The validate_doc_update function to be exported from the design doc.
 */

var types = require('couchtypes/types'),
    app_types = require('./types');

module.exports = function(newDoc, oldDoc, userCtx) {
    function user_is(role) {
        return userCtx.roles.indexOf(role) >= 0;
    }
    if (!user_is("_admin")) {
        // user is not admin, check page _id
        var restricted = ["TAPIRWIKISETTINGS", "NewPage"];
        for (i in restricted) {
            if (newDoc._id && newDoc._id == restricted[i]) throw ({
                forbidden: "Restricted _id: " + restricted[i] + ". Not allowed to modify."
            });
        }
    }
    // now do couchtypes validation
    types.validate_doc_update(app_types, newDoc, oldDoc, userCtx);
};
