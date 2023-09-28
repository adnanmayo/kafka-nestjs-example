/**
 *
 * This method will copy all values from the source to the target if the source has the key defined
 * @param source The source containing master data
 * @param target The target containing sub-set of data
 * @param fields Fields to copy
 */
function safeAssign(source: object, target: object, fields: string[]) {
  fields.forEach((k) => {
    if (k in source) {
      target[k] = source[k];
    }
  });
}

/**
 *
 * Similar to safeAssign, this method will copy all values from the source to the target if the source has the key defined and if the target does not have the key defined
 * @param source The source containing master data
 * @param target The target containing sub-set of data
 * @param fields Fields to copy
 */
function safeMergeAssign(source: object, target: object, fields: string[]) {
  fields.forEach((k) => {
    if (k in source && !(k in target)) {
      target[k] = source[k];
    }
  });
}

export { safeAssign, safeMergeAssign };
