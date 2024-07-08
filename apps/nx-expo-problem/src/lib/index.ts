import { useEffect, useState } from 'react';
import Realm from "realm";

const PersonSchema = {
    name: "Person",
    properties: {
        id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
        name: { type: "string" },
    },

    primaryKey: "id",
};

interface Person {
    id: string,
    name: string,
}

export function usePersonList() {
    const [person, setPerson] = useState<Person[]>([]);
    useEffect(() => {
        Realm.open({ path: "testdb", schema: [PersonSchema] } as Realm.ConfigurationWithoutSync).then(realm => {
            realm.write(() => {
                // Assign a newly-created instance to the variable.
                realm.create("Person", { name: String(Math.random()) });
            });
            const list = realm.objects("Person").filtered("id != null SORT(id DESC) LIMIT(10)");
            setPerson(list.map(i => ({ id: String(i.id), name: String(i.name) })));
        })
    }, [setPerson]);
    return [person, setPerson];
}
