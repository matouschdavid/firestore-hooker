# firestore-hooker

Use Cloud firestore with simple react hooks.

## Installation

```bash
npm install firestore-hooker
```

## Usage

All the examples below are written in TypeScript and use a collection called `tournaments`.
This is the definition of the `Tournament` type:

```ts
export class Tournament {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.date = date;
    }

    static converter: FirestoreDataConverter<Tournament, DocumentData> = {
        toFirestore: (tournament: Tournament) => {
            return {
                name: tournament.name
            };
        },
        fromFirestore: (snapshot: DocumentSnapshot, options:SnapshotOptions) => {
            const data = snapshot.data(options);
            if(!data) throw new Error('Document data is undefined');
            return new Tournament(snapshot.id, data.name);
        }
    }
}
```

The converter is used to convert the data from the firestore to the object and vice versa and is required for every entity and provides type safety. It however does not have to be defined in the entity class.

### Initialize the hooker

The hooker has to be initialized with the firebase app instance. This is done by calling the `initialize` function.

```tsx
initFirestoreHooker(firebaseApp);
```

### Get all documents of a collection with live updates

Getting all the documents in a collection is as simple as calling the `useGetCollection` hook with the collection name and the converter.
```tsx
const {data, loading, error} = useGetCollection('tournaments', Tournament.converter);
```

### Get all documents in a path with live updates

With the following function you can get all the documents in a path with live updates. The last parameter is optional and can be used to filter the documents.
```tsx
const {
        data,
        loading,
        error
    } = useGetMultiple('tournaments', Tournament.converter, where('name', '==', 'Template Tournament'));
```

### Get a single document

Getting a single document can be done once or with live updates. The first parameter is always the collection path. The second one is the document id.

#### With live updates

```tsx
const {data, loading, error, unsubscribe} = useGetDocumentUpdates('tournaments', myDocumentId, Tournament.converter);
```

#### Without live updates

```tsx
const {data, loading, error} = useGetDocument('tournaments', myDocumentId, Tournament.converter);
```