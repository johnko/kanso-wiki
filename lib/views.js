exports.pages = {
    map: function(doc) {
        if (doc.type == 'page') {
            emit(doc._id,{
                'id': doc._id,
                'rev': doc._rev,
                'title': doc.title,
                'body': doc.body,
                'edited_on': doc.edited_on,
                'edited_by': doc.edited_by
            });
        }
    }
};
