exports.pages = {
    map: function(doc) {
        if (doc.type == 'page') {
            emit(doc._id, null);
        }
    }
};
