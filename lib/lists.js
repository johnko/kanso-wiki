/**
 * List functions to be exported from the design doc.
 */

/*
var templates = require('duality/templates');

exports.transaction_list = function(head, req) {

    log('calling transaction list');
    log(head);

    start({
        code: 200,
        headers: {
            'Content-Type': 'text/html'
        }
    });

    // fetch all the rows
    var transaction, transactions = [];

    while (transaction = getRow()) {
        transactions.push(transaction);
    }

    // generate the markup for a list of transactions
    var content = templates.render('transaction_list.html', req, {
        transactions: transactions
    });

    return {
        title: 'Transaction Index',
        content: content
    };

};

exports.sales_report = function(head, req) {

    log('calling sales list');
    log(head);

    start({
        code: 200,
        headers: {
            'Content-Type': 'text/html'
        }
    });

    // fetch all the rows
    var sale, sales = [];

    while (sale = getRow()) {
        sales.push(sale);
    }

    // generate the markup for a list of transactions
    var content = templates.render('sales_report.html', req, {
        sales: sales
    });

    return {
        title: 'Sales Report',
        content: content,
        sales: sales
    };

};

exports.credit_sales_report = function(head, req) {

    start({
        code: 200,
        headers: {
            'Content-Type': 'text/html'
        }
    });

    // fetch all the rows
    var sale, sales = [];

    while (sale = getRow()) {
        sales.push(sale);
    }

    // generate the markup for a list of transactions
    var content = templates.render('credit_sales_report.html', req, {
        sales: sales
    });

    return {
        title: 'Credit Sales',
        content: content
    };

};

exports.transaction_csv = function(head, req) {

    start({
        code: 200,
        headers: {
            'Content-Type': 'text/csv'
        }
    });

    // fetch all the rows
    var transaction = [];
    var field_list = ['date', 'transaction_type', 'items', 'payments', 'comments']
    var content = ['year', 'month', 'day', 'transaction_type', 'items', 'payments', 'comments', 'party.name', 'party.email', 'party.city', 'party.referred_by'] + "\n";

    while (transaction = getRow()) {
        t = transaction.value;
        csv_row = []
        csv_row.push(t.date);
        csv_row.push(t.transaction_type);
        var items_str = '';
        for (subitem in t.items) {
            s = t.items[subitem];
            item_str = '';
            if (s.quantity) {
                item_str += s.quantity
            };
            if (s.description) {
                item_str += " " + s.description
            }
            items_str += item_str;
        };
        csv_row.push(items_str);
        var payments_str = '';
        for (subitem in t.payments) {
            s = t.payments[subitem]
            csv_row.push(s)
        };
        csv_row.push(payments_str);
        csv_row.push(t.comments);
        csv_row.push(t.party.name);
        csv_row.push(t.party.email);
        csv_row.push(t.party.city);
        csv_row.push(t.party.referred_by);
        content += csv_row + "\n";
    }

    return content;

};

exports.transaction = function(head, req) {

    start({
        code: 200,
        headers: {
            'Content-Type': 'text/html'
        }
    });

    // fetch row and set page.
    var row = [];
    var transaction;

    if (row = getRow()) {
        transaction = row.doc;
    } else {
        return {
            title: '404 - Not Found',
            content: 'transaction not found'
        };
    };

    // generate the markup for the transaction
    var content = templates.render("transaction_detail.html", req, {
        transaction: transaction
    });

    return {
        title: transaction.transaction_type + " " + transaction._id,
        content: content,
        req: req
    };

};

exports.timesheet_list = function(head, req) {

    start({
        code: 200,
        headers: {
            'Content-Type': 'text/html'
        }
    });

    // fetch all the rows
    var timesheet, timesheets = [];

    while (timesheet = getRow()) {
        timesheets.push(timesheet);
    }

    // generate the markup for a list of timesheets
    var content = templates.render('timesheet_list.html', req, {
        timesheets: timesheets.reverse()
    });

    return {
        title: 'Timesheet List',
        content: content
    };

};

exports.system_list = function(head, req) {

    log('calling system list');
    log(head);

    start({
        code: 200,
        headers: {
            'Content-Type': 'text/html'
        }
    });

    // fetch all the rows
    var system, systems = [];

    while (system = getRow()) {
        systems.push(system);
    }

    // generate the markup for a list of systems
    var content = templates.render('system_list.html', req, {
        systems: systems
    });

    return {
        title: 'System List',
        content: content
    };

};

exports.system = function(head, req) {

    start({
        code: 200,
        headers: {
            'Content-Type': 'text/html'
        }
    });

    // fetch row and set page.
    var row = [];
    var system;
    if (row = getRow()) {
        system = row.doc
    } else {
        return {
            title: '404 - Not Found',
            content: 'system not found'
        };
    }

    // generate the markup for the system
    var content = templates.render("system_detail.html", req, {
        system: system
    });

    return {
        title: system.product,
        content: content
    };

};

exports.volunteer_hours_total = function(head, req) {
    start({
        code: 200,
        headers: {
            'Content-Type': 'text/html'
        }
    });

    // fetch row and set page.
    var row = [];
    if (row = getRow()) {
        return {
            title: 'volunteer hours',
            content: row.value
        };
    } else {
        return {
            title: '404 - Not Found',
            content: 'volunteer not found'
        };
    }

};

exports.volunteer_timesheet = function(head, req) {

    start({
        code: 200,
        headers: {
            'Content-Type': 'text/html'
        }
    });

    // fetch all the rows
    var timesheet_lines = [];
    var timesheet_line = [];

    while (timesheet_line = getRow()) {
        timesheet_lines.push(timesheet_line);
    }

    // generate the markup for a list of systems
    var content = templates.render('volunteer_timesheet.html', req, {
        timesheet_lines: timesheet_lines
    });

    return {
        title: 'Timesheet',
        content: content
    };

};

exports.hours_report = function(head, req) {

    start({
        code: 200,
        headers: {
            'Content-Type': 'text/html'
        }
    });

    // fetch all the rows
    var period, hours = [];

    while (period = getRow()) {
        hours.push(period);
    }

    // generate the markup for a list of transactions
    var content = templates.render('hours_report.html', req, {
        hours: hours
    });

    return {
        title: 'Volunteer Hours Report',
        content: content
    };

};

//CSV attendance export for import into other systems, e.g. OpenERP
exports.timesheet_csv = function(head, req) {

    //for testing, comment out the following line so you don't have to keep downloading those CSVs...
    start({
        code: 200,
        headers: {
            'Content-Type': 'text/csv'
        }
    });

    var content = [];

    // fetch all the rows
    var timesheet = [];
    var field_list = ['volunteer', 'date', 'work', 'hours', 'description'];

    content += field_list.join() + "\n";

    while (timesheet = getRow()) {
        t = timesheet.value;
        //start building a row from the timesheet
        csv_row = []
        csv_row.push(JSON.stringify(t.volunteer));
        //make the 'date' value - which is normally year,month,day - into a string, then convert to year-month-day
        var date = String(t.date).replace(/,/g, "-")
        csv_row.push(JSON.stringify(date));
        csv_row.push(JSON.stringify(t.work_type));
        csv_row.push(JSON.stringify(t.hours));
        csv_row.push(JSON.stringify(t.description));
        //add the row to the output string, along with a newline
        content += csv_row + "\n";
    }

    //finally, output the CSV
    return content;

};

exports.emails = function(head, req) {

    //for testing, comment out the following line so you don't have to keep downloading those CSVs...
    //start({code: 200, headers: {'Content-Type': 'text/csv'}});

    var content = [];

    // fetch all the rows
    var emails = [];

    while (email = getRow()) {
        content += email.key + "\n";
    }

    //finally, output the CSV
    return content;

};
*/
