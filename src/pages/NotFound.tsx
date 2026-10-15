import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-brand-500">404</h1>
      <p className="text-xl mt-4 text-gray-600">Page not found</p>
      <Link to="/" className="mt-6 px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
        Go Home
      </Link>
    </div>
  )
}