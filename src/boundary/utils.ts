import {AffinityMap} from "./types.ts";

export const findAllParents = (affinityMap: AffinityMap, id: string) => {
  const parents: string[] = []

  const findNearestParent = (affinityMap: AffinityMap, id: string) => {
    for (const parent in affinityMap) {
      if (affinityMap[parent].includes(id)) {
        return parent;
      }
    }

    return null
  }

  let currentId: string | null = id;

  do {
    currentId = findNearestParent(affinityMap, currentId)
    currentId && parents.push(currentId)
  } while (currentId)

  return parents;
}
