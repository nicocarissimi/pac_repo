import React, { useCallback, useEffect, useState } from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import AccountMenu from '@/components/AccountMenu';
import MobileMenu from '@/components/MobileMenu';
import NavbarItem from '@/components/NavbarItem';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Role } from '@/libs/definitions';
import useSearchVideo from '@/hooks/useSearchVideo';
import SearchBar from './SearchBar';

const TOP_OFFSET = 66;

const Navbar = ({search}: {search?: boolean}) => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [showInputSearch, setShowInputSearch] = useState(false)
  const {setSearchValue} = useSearchVideo()
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackground(window.scrollY >= TOP_OFFSET);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAccountMenu = useCallback(() => {
    setShowAccountMenu((current) => !current);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu((current) => !current);
  }, []);

  const handleShowInputSearch = () => {
    setShowInputSearch((p) => !p)
    if(showInputSearch){
      setSearchValue('')
    }
  }

  return (
    <nav className="w-full fixed z-50 top-0">
      <div className={`px-4 md:px-16 py-6 flex flex-row items-center transition duration-500 ${showBackground ? 'bg-zinc-900 bg-opacity-90' : ''}`}>
        <img src="/images/logo.png" className="h-4 lg:h-7" alt="Logo" />
        <div className="flex-row ml-8 gap-7 hidden lg:flex">
          <div onClick={() => router.push('/')}><NavbarItem label="Home" active /></div>
          <div onClick={() => router.push('/playlist')}><NavbarItem label="Playlist" /></div>
          {currentUser?.role === Role.ADMIN && (
            <div onClick={() => router.push('/admin')}><NavbarItem label="Dashboard" /></div>
          )}
        </div>
        <div onClick={toggleMobileMenu} className="lg:hidden flex flex-row items-center gap-2 ml-8 cursor-pointer relative">
          <p className="text-white text-sm">Browse</p>
          <ChevronDownIcon className={`w-4 text-white fill-white transition ${showMobileMenu ? 'rotate-180' : 'rotate-0'}`} />
          <MobileMenu visible={showMobileMenu} />
        </div>
          { showInputSearch &&
          <SearchBar/>
          }
        <div className="flex flex-row ml-auto gap-7 items-center">
          { search &&
            <div className="text-gray-200 hover:text-gray-300 cursor-pointer transition" onClick={handleShowInputSearch} >
              <MagnifyingGlassIcon className="w-6" />
            </div>
          }
          <div onClick={toggleAccountMenu} className="flex flex-row items-center gap-2 cursor-pointer relative">
            <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden">
              <img src={currentUser?.image} alt="/images/user/default-green.png" />
            </div>
            <ChevronDownIcon className={`w-4 text-white fill-white transition ${showAccountMenu ? 'rotate-180' : 'rotate-0'}`} />
            <AccountMenu visible={showAccountMenu} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
