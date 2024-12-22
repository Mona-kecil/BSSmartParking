import Navbar from "./Navbar"
import Analytics from "./Analytics"
import Sessions from "./Sessions"

export default function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="flex w-full h-full justify-center">
        <div className="flex flex-col max-w-[75%] gap-4 my-4">
          <Analytics />
          <Sessions />
        </div>
      </main>

    </>
  )
}

