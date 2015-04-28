/**
 * Kanso document types to export
 */

var Type = require('couchtypes/types').Type,
    fields = require('couchtypes/fields'),
    widgets = require('couchtypes/widgets'),
    permissions = require('couchtypes/permissions');

exports.page = new Type('page', {
    permissions: {
        add: permissions.hasRole('_admin'),
        update: permissions.hasRole('_admin'),
        remove: permissions.hasRole('_admin')
    },
    fields: {
        _id: fields.string({
            validators: [function(doc, val, raw) {
                if (!permissions.hasRole('_admin')) {
                    // user is not admin, check page _id
                    var restricted = ["TAPIRWIKISETTINGS", "NewPage"];
                    for (i in restricted) {
                        if (val == restricted[i]) throw new Error("Restricted _id: " + restricted[i] + ". Not allowed to modify.");
                    }
                }
            }]
        }),
        body: fields.string(),
        edited_by: fields.string(),
        edited_on: fields.string()
    }
});
