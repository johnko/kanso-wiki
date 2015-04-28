/**
 * Update functions to be exported from the design doc.
 */

/*
var templates = require('duality/templates'),
    fields = require('couchtypes/fields'),
    Form = require('couchtypes/forms').Form,
    person = require('./types').person,
    users = require('users');

exports.update_user = function(doc, req) {
    var form = new Form(person);
    form.validate(req);

    if (form.isValid()) {
        var content = templates.render("user_detail.html", req, {
            person: form.values
        });

        return [form.values, {
            content: content
        }];
    } else {
        var content = templates.render('user_form.html', req, {
            form_title: 'My Form',
            method: 'POST',
            action: '/frontdesk/_design/frontdesk/_update/update_user',
            form: form.toHTML(req),
            button: 'Save User'
        });
        return [null, {
            content: content,
            title: 'Update User'
        }];
    }
};
*/
