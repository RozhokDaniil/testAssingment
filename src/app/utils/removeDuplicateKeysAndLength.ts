type ObjectWithArray = { [key: string]: any[] };

export const removeDuplicateKeysAndLength = (arr: ObjectWithArray[]): ObjectWithArray[] =>
    arr.reduce((unique, obj) => {
        const [key] = Object.keys(obj);
        const length = obj[key].length;
        return unique.some(item => {
            const [itemKey] = Object.keys(item);
            return itemKey === key && item[itemKey].length === length;
        }) ? unique : [...unique, obj];
    }, [] as ObjectWithArray[]);
