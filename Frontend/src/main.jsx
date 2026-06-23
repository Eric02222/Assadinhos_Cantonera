import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import Error from './pages/Error.jsx'
import Home from './pages/Home/Home.jsx'
import Login from './pages/Login/Login.jsx'
import Cadastro from './pages/Cadastro/Cadastro.jsx'
import { ToastContainer } from 'react-toastify';
import Layout from './layout/Layout.jsx'
import { AuthProvider } from './context/Context.jsx'
import Historico from './pages/Historico/Historico.jsx'
import Pedidos from './pages/Pedidos/Pedidos.jsx'
import RecuperarSenha from './pages/RecuperarSenha/RecuperarSenha.jsx'
import ListaUsuarios from './pages/ListaUsuarios/ListaUsuarios.jsx'
import Perfil from './pages/Perfil/Perfil.jsx'


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/cadastro", element: <Cadastro /> },
      { path: "/historico", element: <Historico /> },
      { path: "/pedidos", element: <Pedidos /> },
      { path: "/esqueceuSenha", element: <RecuperarSenha /> },
      { path: "/listaUsuarios", element: <ListaUsuarios /> },
      { path: "/perfil", element: <Perfil /> },
      { path: "*", element: <Error /> }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false} />
    </AuthProvider>
  </StrictMode>,
)
