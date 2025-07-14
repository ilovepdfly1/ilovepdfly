import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, GiftIcon, CrownIcon, BriefcaseIcon } from '../components/icons';

const plans = {
  monthly: {
    premium: { id: 'premium-monthly', name: 'Premium', price: 1, period: '/month' },
    pro: { id: 'pro-lifetime', name: 'Pro', price: 10, period: ' for lifetime' },
  },
  yearly: {
    premium: { id: 'premium-yearly', name: 'Premium', price: 5, period: '/year' },
    pro: { id: 'pro-lifetime', name: 'Pro', price: 10, period: ' for lifetime' },
  },
};

const features = [
    { name: 'Access to All Tools', basic: true, premium: true, pro: true },
    { name: 'Unlimited document processing', basic: false, premium: true, pro: true },
    { name: 'Work on Web', basic: true, premium: true, pro: true },
    { name: 'Work on Mobile & Desktop', basic: false, premium: true, pro: true },
    { name: 'No Ads', basic: false, premium: true, pro: true },
    { name: 'Customer support', basic: false, premium: true, pro: true },
    { name: 'AI Assistant Queries', basic: 'Limited', premium: 'Increased', pro: 'Unlimited' },
    { name: 'Maximum file size', basic: 'Standard', premium: 'Large', pro: 'Largest' },
    { name: 'Dedicated servers', basic: false, premium: false, pro: true },
];

const faqData = [
  {
    question: "How do I pay for a premium plan?",
    answer: "We currently accept payments through the eSewa digital wallet. On the payment page, you will find a QR code to scan and complete the payment. After paying, you'll need to upload a screenshot of the transaction confirmation."
  },
  {
    question: "Is my payment secure?",
    answer: "Yes, eSewa is a secure and widely trusted payment gateway in Nepal. Your payment is handled directly by them. We only require a screenshot for manual verification of your purchase."
  },
  {
    question: "What happens after I pay?",
    answer: "After you upload your payment screenshot, you will be directed to contact our support on WhatsApp. Please send your username along with the screenshot. Our team will verify the payment and activate your premium plan as soon as possible."
  },
  {
    question: "Are subscriptions automatically renewed?",
    answer: "No. All our plans are based on one-time payments. Your subscription will not be automatically renewed, so you don't have to worry about recurring charges."
  },
   {
    question: "What does a 'Lifetime' plan mean?",
    answer: "The Pro Lifetime plan gives you access to all premium features for the entire duration of the ILovePDFLY service. It's a one-time payment for long-term value."
  },
  {
    question: "Can I get a refund?",
    answer: "Due to the nature of digital services and our manual payment processing, we generally do not offer refunds. Please try our free tools to ensure our service meets your needs before purchasing a plan."
  }
];

const AccordionItem: React.FC<{
    item: { question: string, answer: string },
    isOpen: boolean,
    toggle: () => void,
    animationRef: (el: HTMLDivElement | null) => void
}> = ({ item, isOpen, toggle, animationRef }) => (
    <div className="border-b border-gray-200 dark:border-gray-800 py-4" ref={animationRef}>
        <button onClick={toggle} className="w-full flex justify-between items-center text-left">
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.question}</span>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </span>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.answer}</p>
        </div>
    </div>
);

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  const animatedElementsRef = useRef<HTMLElement[]>([]);
  animatedElementsRef.current = [];

  const addAnimatedRef = (el: HTMLElement | null) => {
    if (el) animatedElementsRef.current.push(el);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }
    );
    const currentElements = animatedElementsRef.current;
    currentElements.forEach((el) => { if (el) observer.observe(el); });
    return () => { currentElements.forEach((el) => { if (el) observer.unobserve(el); }); };
  });

  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);
  
  const currentPlans = plans[billingCycle];

  return (
    <div className="bg-gray-50 dark:bg-black py-16 md:py-24 overflow-x-hidden">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-12 scroll-animate" ref={addAnimatedRef}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100">Choose the plan that suits you</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Start for free and scale up as you grow. No credit card required.</p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center items-center mb-12 scroll-animate" ref={addAnimatedRef}>
          <button onClick={() => setBillingCycle('monthly')} className={`px-4 py-2 font-semibold transition-colors ${billingCycle === 'monthly' ? 'text-brand-red' : 'text-gray-500'}`}>
            Monthly Billing
          </button>
          <div className="relative mx-2">
            <button onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')} className="w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center transition-colors px-1">
              <span className={`w-4 h-4 rounded-full bg-white dark:bg-gray-200 transform transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`} />
            </button>
          </div>
          <button onClick={() => setBillingCycle('yearly')} className={`px-4 py-2 font-semibold transition-colors relative ${billingCycle === 'yearly' ? 'text-brand-red' : 'text-gray-500'}`}>
            Yearly Billing
            <span className="absolute top-0 right-[-2.5rem] bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">SAVE 58%</span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-8 flex flex-col scroll-animate" ref={addAnimatedRef}>
                <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                        <GiftIcon className="w-7 h-7 text-gray-500" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Basic</h3>
                    </div>
                    <p className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Free</p>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">For simple, occasional use</p>
                    <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                        <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /><span>Access to most tools</span></li>
                        <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /><span>Limited document processing</span></li>
                        <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /><span>Work on Web</span></li>
                    </ul>
                </div>
                <Link to="/signup" className="mt-8 w-full text-center bg-white dark:bg-black text-brand-red font-bold py-3 px-6 rounded-md border-2 border-brand-red hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    Start for free
                </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white dark:bg-black border-2 border-brand-red rounded-lg p-8 flex flex-col relative overflow-hidden scroll-animate" ref={addAnimatedRef}>
                <span className="absolute top-0 right-0 bg-brand-red text-white text-sm font-semibold px-4 py-1 rounded-bl-lg">Most Popular</span>
                <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                        <CrownIcon className="w-7 h-7 text-yellow-500" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{currentPlans.premium.name}</h3>
                    </div>
                    <p className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">${currentPlans.premium.price}<span className="text-lg font-medium text-gray-500 dark:text-gray-400">{currentPlans.premium.period}</span></p>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">For advanced, regular use</p>
                     <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                        <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /><span>Full access to all tools</span></li>
                        <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /><span>Unlimited document processing</span></li>
                        <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /><span>Work on Web, Mobile and Desktop</span></li>
                        <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /><span>No Ads</span></li>
                        <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /><span>Customer support</span></li>
                    </ul>
                </div>
                 <Link to={`/signup?plan=${currentPlans.premium.id}`} className="mt-8 w-full text-center bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3 px-6 rounded-md transition-colors">
                    Go Premium
                </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-8 flex flex-col scroll-animate" ref={addAnimatedRef}>
                 <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                        <BriefcaseIcon className="w-7 h-7 text-blue-500" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{currentPlans.pro.name}</h3>
                    </div>
                    <p className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">${currentPlans.pro.price}<span className="text-lg font-medium text-gray-500 dark:text-gray-400">{currentPlans.pro.period}</span></p>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">For power users and teams</p>
                     <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                        <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /><span>All Premium features</span></li>
                        <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /><span>Largest file size limits</span></li>
                        <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /><span>Unlimited AI Assistant queries</span></li>
                        <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /><span>Dedicated servers for faster processing</span></li>
                        <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-500" /><span>Priority customer support</span></li>
                    </ul>
                </div>
                <Link to={`/signup?plan=${currentPlans.pro.id}`} className="mt-8 w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors">
                    Go Pro
                </Link>
            </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-6xl mx-auto mt-24 scroll-animate" ref={addAnimatedRef}>
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">Compare the plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white dark:bg-black rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="p-6 text-lg font-semibold">Features</th>
                        <th className="p-6 text-lg font-semibold text-center">Basic</th>
                        <th className="p-6 text-lg font-semibold text-center">Premium</th>
                        <th className="p-6 text-lg font-semibold text-center">Pro</th>
                    </tr>
                </thead>
                <tbody>
                    {features.map((feature, index) => (
                        <tr key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                            <td className="p-4 font-medium text-gray-700 dark:text-gray-300">{feature.name}</td>
                            <td className="p-4 text-center">
                                {feature.basic === true ? <CheckCircleIcon className="w-6 h-6 text-green-500 mx-auto" /> : 
                                 feature.basic === false ? <span className="text-gray-400 text-xl font-bold">—</span> : 
                                 <span className="text-gray-600 dark:text-gray-300">{feature.basic}</span>}
                            </td>
                            <td className="p-4 text-center">
                                {feature.premium === true ? <CheckCircleIcon className="w-6 h-6 text-green-500 mx-auto" /> : 
                                 feature.premium === false ? <span className="text-gray-400 text-xl font-bold">—</span> : 
                                 <span className="text-gray-600 dark:text-gray-300">{feature.premium}</span>}
                            </td>
                            <td className="p-4 text-center">
                                {feature.pro === true ? <CheckCircleIcon className="w-6 h-6 text-green-500 mx-auto" /> : 
                                 feature.pro === false ? <span className="text-gray-400 text-xl font-bold">—</span> : 
                                 <span className="text-gray-600 dark:text-gray-300">{feature.pro}</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-24">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12 scroll-animate" ref={addAnimatedRef}>
                Frequently Asked Questions
            </h2>
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-8 rounded-lg shadow-md">
                {faqData.map((item, index) => (
                    <AccordionItem 
                        key={index}
                        item={item}
                        isOpen={openFaq === index}
                        toggle={() => toggleFaq(index)}
                        animationRef={addAnimatedRef}
                    />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default PricingPage;
