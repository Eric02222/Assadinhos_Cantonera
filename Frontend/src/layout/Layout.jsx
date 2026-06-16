import Navbar from '../components/Navbar/Navbar'
import { Outlet } from 'react-router'

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar/>

        <main className="pb-20">
            <Outlet/>
        </main>
    </div>
  )
}

export default Layout
