
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDownIcon, GridIcon, SunIcon, MoonIcon, UserCircleIcon, 
  CameraIcon, KeyIcon, LogoutIcon, MenuIcon, XIcon
} from './icons';
import { TOOLS } from '../constants';
import { Tool } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface CategoryGroup {
  title: string;
  order: number;
  tools: Tool[];
}

interface HeaderProps {
  onOpenProfileImageModal: () => void;
  onOpenChangePasswordModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenProfileImageModal, onOpenChangePasswordModal }) => {
  const [isConvertOpen, setConvertOpen] = useState(false);
  const [isAllToolsOpen, setAllToolsOpen] = useState(false);
  const [isGridMenuOpen, setGridMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const convertRef = useRef<HTMLDivElement>(null);
  const allToolsRef = useRef<HTMLDivElement>(null);
  const gridMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (convertRef.current && !convertRef.current.contains(event.target as Node)) setConvertOpen(false);
      if (allToolsRef.current && !allToolsRef.current.contains(event.target as Node)) setAllToolsOpen(false);
      if (gridMenuRef.current && !gridMenuRef.current.contains(event.target as Node)) setGridMenuOpen(false);
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const closeAllMenus = () => {
    setConvertOpen(false);
    setAllToolsOpen(false);
    setGridMenuOpen(false);
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  }

  const toggleAndCloseOthers = (setter: React.Dispatch<React.SetStateAction<boolean>>, value: boolean) => {
      setConvertOpen(false);
      setAllToolsOpen(false);
      setGridMenuOpen(false);
      setProfileMenuOpen(false);
      setter(value);
  }

  const convertTools = TOOLS.filter(t => t.category === 'convert-from' || t.category === 'convert-to');
  
  const categoryConfig: Record<string, CategoryGroup> = {
    organize: { title: 'Organize PDF', order: 1, tools: [] },
    optimize: { title: 'Optimize PDF', order: 2, tools: [] },
    'convert-to': { title: 'Convert to PDF', order: 3, tools: [] },
    'convert-from': { title: 'Convert from PDF', order: 4, tools: [] },
    edit: { title: 'Edit & Sign', order: 5, tools: [] },
    security: { title: 'Edit & Sign', order: 5, tools: [] },
  };

  const groupedTools = TOOLS.reduce((acc: Record<string, CategoryGroup>, tool) => {
      const categoryKey = tool.category || 'organize';
      if (acc[categoryKey]) {
          acc[categoryKey].tools.push(tool);
      }
      return acc;
  }, JSON.parse(JSON.stringify(categoryConfig)) as Record<string, CategoryGroup>);
  
  if (groupedTools.edit && groupedTools.security) {
    groupedTools.edit.tools.push(...groupedTools.security.tools);
    delete groupedTools.security;
  }
  
  const sortedCategories = Object.values(groupedTools)
    .filter((value, index, self) => index === self.findIndex((t) => t.title === value.title))
    .sort((a,b) => a.order - b.order);


  return (
    <>
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-gray-600 dark:text-gray-300 hover:text-brand-red">
                <MenuIcon className="h-6 w-6"/>
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-brand-red">♥</span>
                <span className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">ILovePDFLY</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-1">
                <Link to="/merge-pdf" className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-brand-red dark:hover:text-brand-red transition-colors rounded-md">Merge PDF</Link>
                <Link to="/split-pdf" className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-brand-red dark:hover:text-brand-red transition-colors rounded-md">Split PDF</Link>
                <Link to="/compress-pdf" className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-brand-red dark:hover:text-brand-red transition-colors rounded-md">Compress PDF</Link>
                <div className="relative" ref={convertRef}>
                  <button onClick={() => toggleAndCloseOthers(setConvertOpen, !isConvertOpen)} className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-brand-red dark:hover:text-brand-red transition-colors rounded-md">
                    <span>Convert PDF</span>
                    <ChevronDownIcon className={`h-5 w-5 ml-1 transition-transform ${isConvertOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isConvertOpen && (
                    <div className="absolute top-full mt-2 w-72 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-2">
                      <div className="grid grid-cols-2 gap-1">
                          {convertTools.map(tool => (
                            <Link key={tool.id} to={`/${tool.id}`} onClick={closeAllMenus} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              <tool.Icon className={`h-6 w-6 ${tool.textColor}`} />
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{tool.title}</span>
                            </Link>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative" ref={allToolsRef}>
                  <button onClick={() => toggleAndCloseOthers(setAllToolsOpen, !isAllToolsOpen)} className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-brand-red dark:hover:text-brand-red transition-colors rounded-md">
                    <span>All PDF Tools</span>
                    <ChevronDownIcon className={`h-5 w-5 ml-1 transition-transform ${isAllToolsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isAllToolsOpen && (
                    <div className="absolute top-full mt-2 -right-1/2 w-[70vw] max-w-4xl bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-6">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                        {sortedCategories.map(cat => (
                          cat.tools.length > 0 &&
                          <div key={cat.title}>
                            <h3 className="text-md font-bold text-brand-red mb-3">{cat.title}</h3>
                            <ul className="space-y-2">
                              {cat.tools.map(tool => (
                                <li key={tool.id}>
                                  <Link to={`/${tool.id}`} onClick={closeAllMenus} className="flex items-center space-x-3 group">
                                    <tool.Icon className={`h-6 w-6 ${tool.textColor}`} />
                                    <div>
                                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-brand-red transition-colors">{tool.title}</p>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Link to="/pricing" className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-brand-red dark:hover:text-brand-red transition-colors rounded-md">Pricing</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative" ref={profileMenuRef}>
                  <button onClick={() => toggleAndCloseOthers(setProfileMenuOpen, !isProfileMenuOpen)} className="block h-10 w-10 rounded-full overflow-hidden border-2 border-transparent hover:border-brand-red transition">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <UserCircleIcon className="h-full w-full text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.username}</p>
                        {user.isPremium && <p className="text-xs font-bold text-yellow-500">Premium Member</p>}
                      </div>
                      <div className="py-1">
                        <button onClick={() => { onOpenProfileImageModal(); closeAllMenus(); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-red transition-colors">
                          <CameraIcon className="h-5 w-5" />
                          <span>Change Photo</span>
                        </button>
                        <button onClick={() => { onOpenChangePasswordModal(); closeAllMenus(); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-red transition-colors">
                          <KeyIcon className="h-5 w-5" />
                          <span>Change Password</span>
                        </button>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                        <button onClick={() => { logout(); closeAllMenus(); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-red transition-colors">
                          <LogoutIcon className="h-5 w-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="hidden sm:block text-gray-600 dark:text-gray-300 hover:text-brand-red dark:hover:text-brand-red transition-colors font-semibold">Login</Link>
                  <Link to="/signup" className="hidden sm:block bg-brand-red hover:bg-brand-red-dark text-white font-bold py-2 px-4 rounded-md transition-colors">Sign up</Link>
                </>
              )}
              <div className="relative" ref={gridMenuRef}>
                <button onClick={() => toggleAndCloseOthers(setGridMenuOpen, !isGridMenuOpen)} className="text-gray-600 dark:text-gray-300 hover:text-brand-red dark:hover:text-brand-red transition-colors">
                  <GridIcon className="h-6 w-6" />
                </button>
                {isGridMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2">
                    <Link to="/about" onClick={closeAllMenus} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-red">About Us</Link>
                    <Link to="/blog" onClick={closeAllMenus} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-red">Blog</Link>
                    <Link to="/contact" onClick={closeAllMenus} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-red">Contact</Link>
                    <Link to="/developer" onClick={closeAllMenus} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-red">About Developer</Link>
                    <Link to="/developer-dashboard" onClick={closeAllMenus} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-red">Admin Dashboard</Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button onClick={toggleTheme} className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-red">
                      <span>Toggle Theme</span>
                      {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[60] md:hidden transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={closeAllMenus}></div>
        <div className="relative w-80 max-w-[80vw] h-full bg-white dark:bg-black p-6 flex flex-col">
          <button onClick={closeAllMenus} className="absolute top-4 right-4 text-gray-500 hover:text-brand-red"><XIcon className="h-6 w-6"/></button>
          <div className="overflow-y-auto flex-grow">
            <h2 className="text-xl font-bold text-brand-red mb-4">All Tools</h2>
            <div className="space-y-4">
              {sortedCategories.map(cat => (
                cat.tools.length > 0 &&
                <div key={cat.title}>
                  <h3 className="text-md font-semibold text-gray-500 dark:text-gray-400 mb-2">{cat.title}</h3>
                  <ul className="space-y-1">
                    {cat.tools.map(tool => (
                      <li key={tool.id}>
                        <Link to={`/${tool.id}`} onClick={closeAllMenus} className="flex items-center space-x-3 group p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                          <tool.Icon className={`h-6 w-6 ${tool.textColor}`} />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-brand-red transition-colors">{tool.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
