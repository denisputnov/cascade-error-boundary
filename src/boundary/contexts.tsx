import {createContext, FC, MutableRefObject, PropsWithChildren, useContext, useRef} from "react";
import {AffinityMap, ChildErrorMap, ThresholdMap} from "./types.ts";

const AffinityMapContext = createContext<MutableRefObject<AffinityMap> | null>(null)
const ChildErrorMapContext = createContext<MutableRefObject<ChildErrorMap> | null>(null)
const ThresholdMapContext = createContext<MutableRefObject<ThresholdMap> | null>(null)
const ErrorIdContext = createContext<string | null>(null)

const useAffinityMapContext = () => {
  const affinityMap = useContext(AffinityMapContext);
  if (!affinityMap) {
    throw Error('Using CascadeErrorBoundary outside ErrorProvider')
  }
  return affinityMap
}

const useChildErrorMapContext = () => {
  const childErrorMap = useContext(ChildErrorMapContext);
  if (!childErrorMap) {
    throw Error('Using CascadeErrorBoundary outside ErrorProvider')
  }
  return childErrorMap
}

const useThresholdMapContext = () => {
  const thresholdMap = useContext(ThresholdMapContext);
  if (!thresholdMap) {
    throw Error('Using CascadeErrorBoundary outside ErrorProvider')
  }
  return thresholdMap
}

const useErrorIdContext = () => {
  return useContext(ErrorIdContext);
}

const CascadeErrorProvider: FC<PropsWithChildren> = ({children}) => {
  const affinityMapRef = useRef({} as AffinityMap);
  const childErrorMapRef = useRef({} as ChildErrorMap);
  const thresholdMapRef = useRef({} as ThresholdMap);

  return (
    <AffinityMapContext.Provider value={affinityMapRef}>
      <ChildErrorMapContext.Provider value={childErrorMapRef}>
        <ThresholdMapContext.Provider value={thresholdMapRef}>
          {children}
        </ThresholdMapContext.Provider>
      </ChildErrorMapContext.Provider>
    </AffinityMapContext.Provider>
  )
}

export {
  useThresholdMapContext,
  useAffinityMapContext,
  useErrorIdContext,
  useChildErrorMapContext,
  CascadeErrorProvider,
  ErrorIdContext
}