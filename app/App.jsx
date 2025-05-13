import HomePage from "./pages/HomePage"
import Navbar from "./components/Navbar/Navbar"

function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="pt-16">
        {/* Add padding top to account for fixed navbar */}
        <HomePage />
      </div>
    </div>
  )
}

export default App
