import {ReactNode} from "react";

export type AffinityMap = Record<string, string[]>;
export type ChildErrorMap = Record<string, number>;
export type ThresholdMap = Record<string, number>;

export type PredefinedFallBack = 'refresh' | 'unmount' | 'default'
export type FallBack = PredefinedFallBack | ReactNode

export type WithRequired<T extends object, J extends keyof T> = Required<Pick<T, J>> & Omit<T, J>;