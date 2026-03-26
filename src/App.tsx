import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Listings from './pages/Listings'
import ListingDetail from './pages/ListingDetail'
import Calculator from './pages/Calculator'
import Favorites from './pages/Favorites'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/favorites" element={<Favorites />} />
      </Route>
    </Routes>
  )
}
