import Navbar from '../components/Navbar/Navbar'
import { Outlet } from 'react-router'

function Layout() {
  return (
    <div>
        <Navbar/>

        <section>
            <Outlet/>
        </section>
    </div>
  )
}

export default Layout