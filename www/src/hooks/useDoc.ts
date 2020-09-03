import { db } from "../firebase";
import { useEffect, useReducer } from "react";

export enum DocActions {
  update,
  delete,
  clear,
}
const documentIntialState = {
  path: null,
  prevPath: null,
  doc: null,
  ref: null,
  loading: true,
};

const documentReducer = (prevState: any, newProps: any) => {
  switch (newProps.action) {
    case DocActions.clear:
      return documentIntialState;
    case DocActions.update:
      // takes data object form the dispatcher and updates doc

      prevState.ref.set({ ...newProps.data }, { merge: true });

      return { ...prevState, doc: { ...prevState.doc, ...newProps.data } };
    case DocActions.delete:
      prevState.ref.delete();
      return null;
    default:
      return { ...prevState, ...newProps };
  }
};

const useDoc = (intialOverrides: any) => {
  const [documentState, documentDispatch] = useReducer(documentReducer, {
    ...documentIntialState,
    ...intialOverrides,
  });
  const setDocumentListner = () => {
    documentDispatch({ prevPath: documentState.path });
    const unsubscribe = db.doc(documentState.path).onSnapshot((snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.data();
        const id = snapshot.id;
        const ref = snapshot.ref;
        const doc = { ...data, id, ref };
        documentDispatch({
          doc,
          ref,
          loading: false,
        });
      } else {
        documentDispatch({
          loading: false,
        });
      }
    });
    documentDispatch({ unsubscribe });
  };
  useEffect(() => {
    const { path, prevPath, unsubscribe } = documentState;
    if (path && path !== prevPath) {
      if (unsubscribe) unsubscribe();
      setDocumentListner();
    }
  }, [documentState]);
  useEffect(
    () => () => {
      if (documentState.unsubscribe) documentState.unsubscribe();
    },
    []
  );
  return [documentState, documentDispatch];
};

export default useDoc;
