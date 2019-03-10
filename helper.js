function findFirebaseData(documents, idField, idValue) {
    for (let i = 0; i < documents.length; i++) {
        let data = documents[i].data();
        if (data[idField] == idValue) {
            return data;
        }
    }

    throw new Error(`Firestore data with field ${idField} and value ${idValue} does not exist!`);
}

function findObjectsInList(list, property, value) {
    let objects = [];

    for (let i = 0; i < list.length; i++) {
        if (list[i][property] == value) {
            objects.push(list[i]);
        }
    }

    return objects;
}

function removeObjectsInList(list, property, value, count) {
    if (count && count !== 1) {
        throw new Error(`Wrong number of objects to remove - ${count}`);
    }

    let i = list.length;
    while (i !== 0) {
        i--;

        if (list[i][property] == value) {
            list.splice(i, 1);
            if (count) {
                break;
            }
        }
    }
}