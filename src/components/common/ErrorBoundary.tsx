import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertOctagon, RotateCcw } from 'lucide-react'
import Button from './Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="size-24 rounded-3xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center mx-auto shadow-lg">
              <AlertOctagon className="size-12 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Oops! Something went wrong.
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                We've encountered an unexpected error. Don't worry, your data is safe.
              </p>
            </div>
            <Button
              onClick={() => window.location.href = '/'}
              leftIcon={<RotateCcw className="size-4" />}
            >
              Reload Application
            </Button>
            <p className="text-xs text-gray-400 mt-8">
              If the problem persists, contact support: irfanzsolutions@gmail.com
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}