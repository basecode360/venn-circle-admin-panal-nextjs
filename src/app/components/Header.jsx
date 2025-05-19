import { Button } from "@/components/ui/button";

export default function Header() {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            My Awesome Site
          </h1>
          {/* Optional: Add navigation or buttons here */}
          <nav>
            <ul className="flex space-x-6 text-gray-600 font-medium">
              <li><a href="/home" className="hover:text-blue-600">Home</a></li>
              <li><a href="/about" className="hover:text-blue-600">About</a></li>
              <li><a href="/contact" className="hover:text-blue-600">Contact</a></li>
            </ul>
          </nav>
          <div>
      <Button>Click me</Button>
    </div>
        </div>
      </header>
    );
  }
  