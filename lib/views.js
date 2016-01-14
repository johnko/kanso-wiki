exports.pages = {
    map: function(doc) {
        if (doc.type == 'page') {
            emit(doc._id, null);
        }
    }
};

exports.systempages = {
    map: function(doc) {
        if (doc.edited_by == 'system') {
            emit(doc, null);
        }
    }
};
