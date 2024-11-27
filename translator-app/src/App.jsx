import TranslatorStart from "./components/TranslatorStart"
import TranslatorApp from "./components/TranslatorApp"
import { useState } from "react"

const App = () => {
  const [showTranslatorApp, setShowTranslatorApp] = useState(false)
  return (
    <div className="w-full h-screen bg-gradient-to-l from-[#b6f492] to-[#338b93]
     flex justify-center items-center ">
      <div className="w-[90%] max-w-lg max-[392px]:h-[90%] sm:h-auto
      bg-[#2d2d2d] rounded-xl shadow-xl shadow-gray-800
      flex flex-col ">
        {showTranslatorApp ? (<TranslatorApp onClose={() => setShowTranslatorApp(false)} />) 
        : <TranslatorStart onStart={() => setShowTranslatorApp(true)} /> }
      </div>

    </div>
  )
}

export default App
