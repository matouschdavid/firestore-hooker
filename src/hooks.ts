import {
    collection,
    doc,
    DocumentData, Firestore,
    FirestoreDataConverter,
    getDoc, getDocs,
    onSnapshot,
    query,
    Query
} from "@firebase/firestore";
import {useEffect, useState} from "react";

const errorMessage = 'Firestore not initialized. Call initFirestoreHooker(firestore) before using this hook.';

let firestore: Firestore;

export const initFirestoreHooker = (firestoreInstance: Firestore) => {
    firestore = firestoreInstance;
}

const checkFirestore = () => {
    if(!firestore) throw new Error(errorMessage);
}

export const useGetDocument = <T>(collectionPath: string, docId: string, converter: FirestoreDataConverter<T>) => {
    console.log('useGetDocument');
    checkFirestore();
    console.log('firestore', firestore);

    const [data, setData] = useState<T>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(firestore, collectionPath, docId).withConverter(converter);
                const data = await getDoc(docRef);
                setData(data.data());
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [collectionPath, docId, converter]);

    return {data, loading, error};
}

export const useGetDocumentUpdates = <T>(collectionPath: string, docId: string, converter: FirestoreDataConverter<T>) => {
    console.log('useGetDocument');
    checkFirestore();
    console.log('firestore', firestore);

    const [data, setData] = useState<T>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [unsubscribe, setUnsubscribe] = useState<() => void>(() => {});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(firestore, collectionPath, docId).withConverter(converter);
                const unsubscribe = onSnapshot(docRef, (doc) => {
                    setData(doc.data());
                });
                setUnsubscribe(() => unsubscribe);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [collectionPath, docId, converter]);

    return {data, loading, error, unsubscribe};
}

export const useGetCollection = <T>(collectionPath: string, converter: FirestoreDataConverter<T>) => {
    console.log('useGetDocument');
    checkFirestore();
    console.log('firestore', firestore);

    return useGet(collection(firestore, collectionPath), converter);
}

export const useGetMultiple = <T>(path: string, converter: FirestoreDataConverter<T>, query: any = null) => {
    console.log('useGetDocument');
    checkFirestore();
    console.log('firestore', firestore);

    return useGet(collection(firestore, path), converter, query);
}

const useGet = <T>(ref: Query<unknown, DocumentData>, converter: FirestoreDataConverter<T>, condition: any = null) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(ref, condition).withConverter(converter);
                const data = await getDocs(q);
                const result = data.docs.map(doc => doc.data());
                setData(result);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ref, condition, converter]);

    return {data, loading, error};
}