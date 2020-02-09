interface groupByFun<K, V> {
  (item: V, index: number, origin: V[]): K
}

class Collection<K, V> {
  _collectList: Map<K, V[]> = new Map<K, V[]>();
  _origin: V[] = [];

  constructor(origin: V[], groupBy: groupByFun<K, V>) {
    this._origin = origin;
    this._collectList = this.collect(groupBy);
  }

  collect(groupBy: groupByFun<K, V>): Map<K, V[]> {
    let _m = new Map();
    this._origin.forEach((item: V, index: number, origin: V[]) => {	
      const _id = groupBy(item, index, origin);
      if (_m.has(_id)) {
        const toUpdateItem = _m.get(_id);
        const newItem = toUpdateItem.concat([item]);
        _m.set(_id, newItem);
      } else {
        _m.set(_id, [item])
      }
    })
    return _m;
  }

  toArray(): V[][] {
    return [...this._collectList].map(([_, v]) => v)
  }

  getCollectionList(): Map<K, V[]> {
    return this._collectList;
  }
}

export default Collection;