import { Button } from "@/components/ui/button"
import { useStore } from "@/store/useStore"

function App() {
  const { count, increment, decrement, reset } = useStore()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-slate-800">
          Mermaid Project
        </h1>
        
        <div className="mb-6 text-center">
          <p className="text-lg text-slate-600 mb-2">Count: {count}</p>
        </div>
        
        <div className="flex gap-3 justify-center">
          <Button onClick={decrement} variant="outline">
            Decrement
          </Button>
          <Button onClick={increment}>
            Increment
          </Button>
          <Button onClick={reset} variant="destructive">
            Reset
          </Button>
        </div>
        
        <p className="mt-6 text-sm text-slate-500 text-center">
          Built with Vite, React, TypeScript, Tailwind CSS, Zustand, and shadcn/ui
        </p>
      </div>
    </div>
  )
}

export default App