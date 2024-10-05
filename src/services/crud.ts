//crud.ts
import {
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';
import I_Auto from './Types/Benutzer/I_Auto';

/* ------------------------------------------------------------ */
// Read All
export const getAllDaten = async <T>(
  collection: CollectionReference<DocumentData, DocumentData>
): Promise<T[]> => {
  try {
    const querySnapshot = await getDocs(collection);
    const autosList: T[] = [];
    querySnapshot.forEach((doc) => {
      autosList.push(doc.data() as T);
    });
    console.log('All documents data:', autosList);
    return autosList;
  } catch (e) {
    console.error('Error getting documents: ', e);
    return [];
  }
};

// Read
export const getData = async <T>(
  collection: CollectionReference<DocumentData, DocumentData>,
  id: string
): Promise<T | null> => {
  try {
    const autoDocRef = doc(collection, id);
    const autoDoc = await getDoc(autoDocRef);
    if (autoDoc.exists()) {
      console.log('Document data:', autoDoc.data());
      return autoDoc.data() as T;
    } else {
      throw new Error('No such document!');
    }
  } catch (e) {
    console.error('Error getting document: ', e);
    throw e;
  }
};

// Create
export const createData = async <T extends { id: string }>(
  collection: CollectionReference<DocumentData, DocumentData>,
  newData: T
) => {
  try {
    const autoDoc = doc(collection, newData.id); // Specify the document ID
    await setDoc(autoDoc, newData);
    console.log('Document written with ID: ', newData.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

// Update
export const updateData = async <T extends { id: string }>(
  collection: CollectionReference<DocumentData, DocumentData>,
  updatedData: T
) => {
  try {
    const autoDocRef = doc(collection, updatedData.id); // Specify the document ID
    await updateDoc(autoDocRef, { ...updatedData });
    console.log('Document updated with ID: ', updatedData.id);
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

// Delete
export const deleteData = async (
  collection: CollectionReference<DocumentData, DocumentData>,
  id: string
) => {
  try {
    const autoDocRef = doc(collection, id);
    await deleteDoc(autoDocRef);
    console.log('Document deleted with ID: ', id);
  } catch (e) {
    console.error('Error deleting document: ', e);
  }
};
/* ------------------------------------------------------------ */

/* // Read All
export const getAllDaten = async (
  collection: CollectionReference<DocumentData, DocumentData>
) => {
  try {
    const querySnapshot = await getDocs(collection);
    const autosList: I_Auto[] = [];
    querySnapshot.forEach((doc) => {
      autosList.push(doc.data() as I_Auto);
    });
    console.log('All documents data:', autosList);
    return autosList;
  } catch (e) {
    console.error('Error getting documents: ', e);
    return [];
  }
};

// Read
export const getData = async (
  collection: CollectionReference<DocumentData, DocumentData>,
  id: string
): Promise<I_Auto | null> => {
  try {
    const autoDocRef = doc(collection, id);
    const autoDoc = await getDoc(autoDocRef);
    if (autoDoc.exists()) {
      console.log('Document data:', autoDoc.data());
      return autoDoc.data() as I_Auto;
    } else {
      throw new Error('No such document!');
    }
  } catch (e) {
    console.error('Error getting document: ', e);
    throw e;
  }
};

// Create
export const createData = async (
  collection: CollectionReference<DocumentData, DocumentData>,
  newData: I_Auto
) => {
  try {
    const autoDoc = doc(collection, newData.id); // Specify the document ID
    await setDoc(autoDoc, newData);
    console.log('Document written with ID: ', newData.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

// Update
export const updateData = async (
  collection: CollectionReference<DocumentData, DocumentData>,
  updatedData: I_Auto
) => {
  try {
    const autoDocRef = doc(collection, updatedData.id); // Specify the document ID
    await updateDoc(autoDocRef, { ...updatedData });
    console.log('Document updated with ID: ', updatedData.id);
  } catch (e) {
    console.error('Error updating document: ', e);
  }
 
};

// Delete
export const deleteData = async (
  collection: CollectionReference<DocumentData, DocumentData>,
  id: string
) => {
  try {
    const autoDocRef = doc(collection, id);
    await deleteDoc(autoDocRef);
    console.log('Document deleted with ID: ', id);
  } catch (e) {
    console.error('Error deleting document: ', e);
  }
}; */

/* Beispiel: const xxxxxCollection = collection(db, 'nom_de_la_Collection'); */
