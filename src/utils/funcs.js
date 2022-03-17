import { omit } from 'ramda';

export const normalizeQueryUpdate = (table, keyId, values) => {
  if(values && Object.keys(values).length > 0) {
    let stringKey = '';
    const arrValues = [];
    Object.keys(omit([keyId], values)).forEach((e,idx) => {
      if(idx > 0) {
        stringKey += `, ${e}=$${idx+1}`
      }else {
        stringKey += `${e}=$${idx+1}`;
      }
      arrValues.push(values[e]);
    });
    arrValues.push(values[keyId]);

    return {sql: `UPDATE ${table} SET ${stringKey} WHERE id=$${Object.keys(values).length}`, values: arrValues}
  }
  return {sql: null , values: null}
}