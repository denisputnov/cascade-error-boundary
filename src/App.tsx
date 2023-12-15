import { ProblemComponent } from "./ProblemComponent.tsx";
import { CascadeErrorBoundary, CascadeErrorProvider } from "./boundary";

function App() {
  return (
    <CascadeErrorProvider>
      <CascadeErrorBoundary>
        <div className="flex justify-center items-center">
          <CascadeErrorBoundary>
            <ProblemComponent />
          </CascadeErrorBoundary>

          <CascadeErrorBoundary>
            <ProblemComponent />
          </CascadeErrorBoundary>

          <CascadeErrorBoundary >
            <div className='flex flex-col'>
              <CascadeErrorBoundary >
                <ProblemComponent />
              </CascadeErrorBoundary>

              <CascadeErrorBoundary >
                <ProblemComponent />
              </CascadeErrorBoundary>

              <CascadeErrorBoundary>
                <ProblemComponent />
              </CascadeErrorBoundary>
            </div>
          </CascadeErrorBoundary>

          <CascadeErrorBoundary>
            <ProblemComponent />
          </CascadeErrorBoundary>

        </div>

      </CascadeErrorBoundary>
    </CascadeErrorProvider>
  )
}

export default App
