// components/Header.js
import Link from 'next/link';
import { ModeToggle } from '../ModeToggle/modeToggle';
import { ScrollLink } from '../ScrollLink';

const Header = () => {
    return (
        <header className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-2xl font-bold text-gray-900">
                <Link href="/">Łukasz Wasyłeczko</Link>
              </div>
              
              <nav className="flex items-center space-x-8">
                <Link href="/" className="text-gray-900 hover:text-blue-500 font-medium transition-colors">
                  START
                </Link>
                <Link href="/artykuly" className="text-gray-900 hover:text-blue-500 font-medium transition-colors">
                  ARTYKUŁY
                </Link>
                <ScrollLink href="/#contact" className="text-gray-900 hover:text-blue-500 font-medium transition-colors">
                  KONTAKT
                </ScrollLink>
              </nav>
            </div>
          </div>
        </header>
 );
};

export default Header;