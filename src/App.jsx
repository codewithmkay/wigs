import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Installation from './pages/Installation'
import Book from './pages/Book'
import Blog from './pages/Blog'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/installation" element={<Installation />} />
          <Route path="/book" element={<Book />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}