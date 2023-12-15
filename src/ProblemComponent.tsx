import {FC, useEffect, useRef, useState} from "react";

interface ProblemComponentProps{
  drop?: boolean
}

export const useRenderCount = () => {
  const ref = useRef(1)

  useEffect(() => {
    ref.current += 1
  })

  return ref.current
}

export const ProblemComponent: FC<ProblemComponentProps>= ({ drop }) => {
  const [count, setCount] = useState(0)
  const renders = useRenderCount()

  if (drop) {
    throw Error("DROP")
  }

  return <div className="w-64 border-4 p-4 flex flex-col gap-2">
    <span>Renders: {renders}</span>
    <span>Problem Component</span>
    <span>Count: {count}</span>
    <button className="bg-cyan-700 text-amber-50 rounded-2xl hover:bg-cyan-900 transition-all ease-in" onClick={() => setCount(prev => prev + 1)}>Increment</button>
  </div>
}