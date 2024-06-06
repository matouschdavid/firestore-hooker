import { Firestore, FirestoreDataConverter } from "@firebase/firestore";
export declare const initFirestore: (firestoreInstance: Firestore) => void;
export declare const useGetDocument: <T>(collectionPath: string, docId: string, converter: FirestoreDataConverter<T>) => {
    data: T | undefined;
    loading: boolean;
    error: Error | null;
};
export declare const useGetDocumentUpdates: <T>(collectionPath: string, docId: string, converter: FirestoreDataConverter<T>) => {
    data: T | undefined;
    loading: boolean;
    error: Error | null;
    unsubscribe: () => void;
};
export declare const useGetCollection: <T>(collectionPath: string, converter: FirestoreDataConverter<T>) => {
    data: T[];
    loading: boolean;
    error: Error | null;
};
export declare const useGetMultiple: <T>(path: string, converter: FirestoreDataConverter<T>, query?: any) => {
    data: T[];
    loading: boolean;
    error: Error | null;
};
