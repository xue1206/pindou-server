
export const filterNotNull = (obj: object): object => {
  return Object.entries(obj).reduce(
    (theObj, [ key, value ]) => {
      if (value) {
        theObj[key] = value;
      }
      return theObj;
    },
    {}
  );
};
