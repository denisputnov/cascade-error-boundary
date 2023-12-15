import {
  Component,
  ComponentType,
  FC, memo,
  MutableRefObject,
  ReactNode,
  useId,
  useInsertionEffect
} from "react";
import {AffinityMap, ChildErrorMap, FallBack, ThresholdMap, WithRequired} from "./types.ts";
import {
  ErrorIdContext,
  useAffinityMapContext,
  useChildErrorMapContext,
  useErrorIdContext,
  useThresholdMapContext
} from "./contexts.tsx";
import {FallbackUI} from "./fallback-ui.component.tsx";
import {findAllParents} from "./utils.ts";

interface CascadeErrorBoundaryProps {
  children?: ReactNode;
  fallback?: FallBack;
  threshold?: number;
  forceDrop?: boolean;
}

type PrivateProps = WithRequired<CascadeErrorBoundaryProps, 'threshold'> & {
  boundaryId: string;
  parentId: string | null;
  affinityMap: MutableRefObject<AffinityMap>;
  childErrorMap: MutableRefObject<ChildErrorMap>;
  thresholdMap: MutableRefObject<ThresholdMap>;
}

interface CascadeErrorBoundaryState {
  hasError: boolean;
}

class CascadeErrorBoundary extends Component<CascadeErrorBoundaryProps, CascadeErrorBoundaryState> {
  public state: CascadeErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): CascadeErrorBoundaryState {
    return {hasError: true};
  }

  public componentDidCatch() {
    const {
      forceDrop,
      boundaryId,
      affinityMap,
      childErrorMap,
      thresholdMap
    } = this.props as PrivateProps;
    if (forceDrop) {
      throw Error(`Force Drop in ${boundaryId}`);
    }

    const parentList = findAllParents(affinityMap.current, boundaryId);

    parentList.forEach(parent => {
      if (childErrorMap.current?.[parent]) {
        childErrorMap.current[parent] += 1
      } else {
        childErrorMap.current[parent] = 1
      }

      const parentThreshold = thresholdMap.current?.[parent];

      if (parentThreshold > 1 && childErrorMap.current?.[parent] >= parentThreshold) {
        throw Error(`Threshold [${parentThreshold}] reached in CascadeErrorBoundary with id: ${boundaryId}`)
      }
    })
  }

  public componentWillUnmount() {
    const {
      boundaryId,
      affinityMap,
      childErrorMap,
      thresholdMap
    } = this.props as PrivateProps;

    delete thresholdMap.current[boundaryId];

    for (const parent in affinityMap) {
      if (affinityMap.current[parent]?.includes(boundaryId) && affinityMap.current[parent]?.length > 1) {
        affinityMap.current[parent] = affinityMap.current[parent].filter(child => child !== boundaryId)
      } else {
        delete affinityMap.current[parent]
      }
    }

    const currentChildErrorsAmount: number | undefined = childErrorMap.current?.[boundaryId];

    if (currentChildErrorsAmount !== undefined) {
      const parentList = findAllParents(affinityMap.current, boundaryId);

      parentList.forEach((parent) => {
        const newErrorsAmount = childErrorMap.current[parent] - currentChildErrorsAmount;
        if (newErrorsAmount > 0) {
          childErrorMap.current[parent] = newErrorsAmount;
        } else {
          delete childErrorMap.current[parent];
        }
      })
    }
  }

  public render() {
    const {
      children,
      fallback = 'default',
      boundaryId
    } = this.props as PrivateProps;

    return (
      <ErrorIdContext.Provider value={boundaryId}>
        {this.state.hasError ? <FallbackUI fallback={fallback}/> : children}
      </ErrorIdContext.Provider>
    )
  }
}

const withContexts = <BaseProps extends CascadeErrorBoundaryProps>(Component: ComponentType<BaseProps>): FC<BaseProps> => {
  return function WrappedComponent(props: BaseProps) {
    const boundaryId = useId();

    const parentId = useErrorIdContext();
    const affinityMap = useAffinityMapContext();
    const childErrorMap = useChildErrorMapContext();
    const thresholdMap = useThresholdMapContext()

    useInsertionEffect(() => {
      if (parentId) {
        affinityMap.current[parentId] = [...(affinityMap.current[parentId] ?? []), boundaryId]
      }

      thresholdMap.current[boundaryId] = props.threshold ?? Number.POSITIVE_INFINITY;
    }, [])

    return (
      <Component
        {...props}
        boundaryId={boundaryId}
        parentId={parentId}
        affinityMap={affinityMap}
        childErrorMap={childErrorMap}
        thresholdMap={thresholdMap}
      />
    );
  }
}

export default memo(withContexts(CascadeErrorBoundary));
