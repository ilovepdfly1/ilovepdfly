
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ToolPage from './pages/ToolPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DeveloperPage from './pages/DeveloperPage';
import FaqPage from './pages/FaqPage';
import SitemapPage from './pages/SitemapPage';
import PricingPage from './pages/PricingPage';
import PaymentPage from './pages/PaymentPage';
import DeveloperDashboardPage from './pages/DeveloperDashboardPage';
import ThankYouPage from './pages/ThankYouPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTopButton from './components/ScrollToTopButton';
import Modal from './components/Modal';
import { privacyPolicy, termsOfService } from './content/legal';
import ProfileImageModal from './components/ProfileImageModal';
import ChangePasswordModal from './components/ChangePasswordModal';

type ModalContent = {
  title: string;
  content: JSX.Element;
} | null;

function App() {
  const [modalContent, setModalContent] = useState<ModalContent>(null);
  const [isProfileImageModalOpen, setProfileImageModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const isModalOpen = modalContent !== null;

  const openModal = (type: 'privacy' | 'terms') => {
    if (type === 'privacy') {
      setModalContent(privacyPolicy);
    } else {
      setModalContent(termsOfService);
    }
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen font-sans text-gray-800 dark:text-gray-200">
          <Header 
            onOpenProfileImageModal={() => setProfileImageModalOpen(true)}
            onOpenChangePasswordModal={() => setChangePasswordModalOpen(true)}
          />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/developer" element={<DeveloperPage />} />
              <Route path="/developer-dashboard" element={<DeveloperDashboardPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/payment/:planId" element={<PaymentPage />} />
              <Route path="/:toolId" element={<ToolPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/sitemap" element={<SitemapPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
            </Routes>
          </main>
          <Footer onLegalLinkClick={openModal} />
          <ScrollToTopButton />
          <Modal 
            isOpen={isModalOpen} 
            onClose={closeModal} 
            title={modalContent?.title || ''}
          >
            {modalContent?.content}
          </Modal>
          <ProfileImageModal 
            isOpen={isProfileImageModalOpen} 
            onClose={() => setProfileImageModalOpen(false)} 
          />
          <ChangePasswordModal 
            isOpen={isChangePasswordModalOpen}
            onClose={() => setChangePasswordModalOpen(false)}
          />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
