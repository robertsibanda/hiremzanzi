export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold text-white">HireMzanzi</span>
            <p className="text-sm mt-1">Find your next opportunity</p>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} HireMzanzi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
