'use client';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Line from '@/components/Line';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { footerData } from '@/data/footer';

interface FooterProps {
    className?: string;
}

const Footer = ({ className = '' }: FooterProps) => {
    const { t, i18n } = useTranslation();
    const dark = useSelector((state: RootState) => state.theme.dark);
    const reduxLanguage = useSelector((state: RootState) => state.language.language);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch by not rendering until mounted
    useEffect(() => {
        setMounted(true);
    }, []);

    // Use Redux language as source of truth
    const currentLang = reduxLanguage;
    const isFarsi = currentLang === 'fa';

    const currentYear = new Date().getFullYear();

    // Language-specific classes
    const langClasses = {
        isFarsi: isFarsi,
        fontClass: isFarsi ? 'font-farsi-chalkboard' : 'font-cursive',
        textAlign: isFarsi ? 'text-right' : 'text-left',
        flexDirection: isFarsi ? 'flex-row-reverse' : 'flex-row',
        marginClass: isFarsi ? 'mr-2' : 'ml-2',
        scrollPosition: isFarsi ? 'left-6' : 'right-6',
        hoverTranslate: isFarsi ? 'hover:-translate-x-1' : 'hover:translate-x-1',
        responsiveText: isFarsi ? 'text-right' : 'text-left',
        responsiveFlex: isFarsi ? 'flex-row-reverse' : 'flex-row',
        mdResponsiveFlex: isFarsi ? 'flex-row-reverse' : 'flex-row',
        colReverse: isFarsi ? 'flex-col-reverse' : 'flex-col'
    };

    // Show/hide scroll to top button
    useEffect(() => {
        if (!mounted) return;

        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [mounted]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Theme-specific classes
    const themeClasses = {
        footerBg: dark ? 'bg-[#032e15]' : 'bg-[#f7fee7]',
        titleColor: dark ? 'text-[#92c8fa]' : 'text-[#032e15]',
        textColor: dark ? 'text-[#92c8fa]' : 'text-[#032e15]',
        headingColor: dark ? 'text-[#ffc904]' : 'text-[#032e15]',
        socialBg: dark ? 'bg-[#233045] hover:bg-[#1a2a39] text-[#ffc904]' : 'bg-white hover:bg-[#e0fcea] text-[#032e15]',
        bottomBg: dark ? 'border-[#1a2a39] bg-[#1a2a39]' : 'border-[#e0fcea] bg-[#e0fcea]',
        scrollBg: dark ? 'bg-[#ffc904] text-[#032e15] hover:bg-[#008f39]' : 'bg-[#032e15] text-[#ffc904] hover:bg-[#008f39]'
    };

    // Don't render anything until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <>
                <Line width='100vw' />
                <footer
                    id="footer"
                    className={`${className} bg-[#f7fee7] font-cursive relative`} // Default fallback
                >
                    <div className="max-w-full mx-auto px-4 sm:px-2 lg:px-0 py-6 sm:py-8">
                        <div className="max-w-full mx-auto px-4 sm:px-2 lg:px-0 py-6 sm:py-8">
                            <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap justify-around">
                                <div className="md:w-full lg:w-1/4 mb-8 md:mb-13 lg:mb-0 md:px-9 lg:px-0 text-left">
                                    <div className="flex items-center mb-3 flex-row">
                                        <div className="w-8 h-8 bg-gradient-to-r from-[#ffc904] to-[#008f39] rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-bold text-[#032e15] ml-2">
                                            Loading...
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </>
        );
    }

    return (
        <>
            <Line width='100vw' />
            <footer
                id="footer"
                className={`${className} ${themeClasses.footerBg} ${langClasses.fontClass} relative`}
            >
                {/* Scroll to Top Button */}
                {showScrollTop && (
                    <button
                        onClick={scrollToTop}
                        className={`fixed bottom-7 sm:bottom-6 ${langClasses.scrollPosition} z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${themeClasses.scrollBg}`}
                        aria-label={t('footer.scroll_top')}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>
                )}

                {/* Main Footer Content */}
                <div className="max-w-full mx-auto px-4 sm:px-6 md:px-15 lg:px-10 py-6 sm:py-8">
                    <div className="max-w-full mx-auto py-6 sm:py-8">
                        <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap justify-between">

                            {/* Restaurant Info */}
                            <div className={`md:w-full lg:w-1/4 flex flex-col items-start mb-8 md:mb-13 lg:mb-0 ${langClasses.textAlign}`}>
                                {!langClasses.isFarsi ?
                                    <div className={`flex items-center mb-3 ${langClasses.flexDirection}`}>
                                        <img src="images/logo.jpg" alt="logo" className='size-9 rounded-full' />
                                        <h3 className={`font-bold ${themeClasses.titleColor} ${langClasses.marginClass}`}>
                                            {t('footer.restaurant_name')}
                                        </h3>
                                    </div>
                                    :
                                    <div className={`flex items-center mb-3 ${langClasses.flexDirection}`}>
                                        <h3 className={`text-base font-bold ${themeClasses.titleColor} ${langClasses.marginClass}`}>
                                            {t('footer.restaurant_name')}
                                        </h3>
                                        <img src="images/logo.jpg" alt="logo" className='size-8 rounded-full' />
                                    </div>
                                }
                                <p className={`${themeClasses.textColor} text-xs sm:text-sm leading-relaxed mb-3 opacity-80`}>
                                    {t('footer.description')}
                                </p>

                                {/* Social Media */}
                                <div className={`flex gap-3 mt-4 ${langClasses.flexDirection}`}>
                                    {footerData.socialMedia.map((social, index) => (
                                        <a
                                            key={social.name}
                                            href={social.href}
                                            className={`group p-2 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-12 ${themeClasses.socialBg} shadow-lg hover:shadow-xl ${social.color} border-2 border-transparent hover:border-[#ffc904] hover:border-opacity-50`}
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <svg className="size-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"
                                                style={{ transform: social.name === 'WhatsApp' ? 'scale(2)' : 'none' }}
                                            >
                                                <path d={social.icon} />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className={`mb-8 md:mb-0 ${langClasses.textAlign}`}>
                                <h4 className={`text-sm sm:text-base font-semibold mb-2 ${themeClasses.headingColor}`}>
                                    {t('footer.contact_info')}
                                </h4>
                                <div>
                                    <div className={`flex items-center ${langClasses.isFarsi ? "justify-end" : "justify-start"} ${langClasses.flexDirection} mt-4`}>
                                        {!langClasses.isFarsi ?
                                            <>
                                                <svg className={`w-3 h-3 text-[#ffc904] ${langClasses.isFarsi ? 'ml-2' : 'mr-2'} flex-shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className={`text-xs sm:text-sm leading-relaxed ${themeClasses.textColor} opacity-80`}>
                                                    {t('footer.address')}
                                                </span>
                                            </>
                                            :
                                            <>
                                                <span className={`text-xs sm:text-sm leading-relaxed ${themeClasses.textColor} opacity-80`}>
                                                    {t('footer.address')}
                                                </span>
                                                <svg className={`w-3 h-3 text-[#ffc904] ${langClasses.isFarsi ? 'ml-2' : 'mr-2'} flex-shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </>
                                        }
                                    </div>
                                    <div className={`flex items-center ${langClasses.isFarsi ? "justify-end" : "justify-start"} ${langClasses.flexDirection} mt-4`}>
                                        {!langClasses.isFarsi ?
                                            <>
                                                <svg className={`w-3 h-3 text-[#ffc904] ${langClasses.isFarsi ? 'ml-2' : 'mr-2'} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <a href={`tel:${footerData.contact.phone}`} className={`text-xs sm:text-sm transition-colors duration-200 hover:text-[#ffc904] ${themeClasses.textColor} opacity-80 hover:opacity-100`}>
                                                    {t('footer.phone')}
                                                </a>
                                            </>
                                            :
                                            <>
                                                <a href={`tel:${footerData.contact.phone}`} className={`text-xs sm:text-sm transition-colors duration-200 hover:text-[#ffc904] ${themeClasses.textColor} opacity-80 hover:opacity-100`}>
                                                    {t('footer.phone')}
                                                </a>
                                                <svg className={`w-3 h-3 text-[#ffc904] ${langClasses.isFarsi ? 'ml-2' : 'mr-2'} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </>
                                        }
                                    </div>
                                    <div className={`flex items-center ${langClasses.isFarsi ? "justify-end" : "justify-start"} ${langClasses.flexDirection} mt-4`}>
                                        {!langClasses.isFarsi ?
                                            <>
                                                <svg className={`w-3 h-3 text-[#ffc904] ${langClasses.isFarsi ? 'ml-2' : 'mr-2'} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <a href={`mailto:${footerData.contact.email}`} className={`text-xs sm:text-sm transition-colors duration-200 hover:text-[#ffc904] ${themeClasses.textColor} opacity-80 hover:opacity-100 break-all`}>
                                                    {t('footer.email')}
                                                </a>
                                            </>
                                            :
                                            <>
                                                <a href={`mailto:${footerData.contact.email}`} className={`text-xs sm:text-sm transition-colors duration-200 hover:text-[#ffc904] ${themeClasses.textColor} opacity-80 hover:opacity-100 break-all`}>
                                                    {t('footer.email')}
                                                </a>
                                                <svg className={`w-3 h-3 text-[#ffc904] ${langClasses.isFarsi ? 'ml-2' : 'mr-2'} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className={`w-full sm:w-fit md:w-1/4 lg:w-1/6 ${langClasses.textAlign}`}>
                                <h4 className={`text-sm sm:text-base font-semibold mb-2 ${themeClasses.headingColor}`}>
                                    {t('footer.hours')}
                                </h4>
                                <div className="mb-4">
                                    {!langClasses.isFarsi ?
                                        footerData.businessHours.en.map((schedule, index) => (
                                            <div key={index} className={`flex ${langClasses.flexDirection} justify-between mt-4 text-xs sm:text-sm`}>
                                                <span className={`mr-20 md:mr-0 ${themeClasses.textColor} opacity-80`}>
                                                    {t(schedule.dayKey)}
                                                </span>
                                                <span className={`text-[#ffc904] font-medium text-xs sm:text-sm`}>
                                                    {schedule.hours}
                                                </span>
                                            </div>
                                        ))
                                        :
                                        footerData.businessHours.fa.map((schedule, index) => (
                                            <div key={index} className={`flex ${langClasses.flexDirection} justify-between mt-4 text-xs`}>
                                                <span className={`text-[#ffc904] font-medium text-xs`}>
                                                    {schedule.hours}
                                                </span>
                                                <span className={`ml-20 md:mr-0 ${themeClasses.textColor} opacity-80`}>
                                                    {t(schedule.dayKey)}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={`border-t ${themeClasses.bottomBg}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <div className={`flex ${langClasses.colReverse} md:${langClasses.mdResponsiveFlex} justify-center items-center gap-2`}>
                            <p className={`text-[10px] md:text-xs ${themeClasses.textColor} opacity-80 text-center md:${langClasses.responsiveText}`}>
                                © {currentYear} {t('footer.restaurant_name')}. {t('footer.rights')}
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;