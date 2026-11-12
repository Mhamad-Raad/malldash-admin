import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import sidebarEn from './locales/Sidebar/en.json';
import sidebarAr from './locales/Sidebar/ar.json';
import sidebarKu from './locales/Sidebar/ku.json';

import navbarEn from './locales/Navbar/en.json';
import navbarAr from './locales/Navbar/ar.json';
import navbarKu from './locales/Navbar/ku.json';

import usersEn from './locales/Users/en.json';
import usersAr from './locales/Users/ar.json';
import usersKu from './locales/Users/ku.json';

import buildingsEn from './locales/Buildings/en.json';
import buildingsAr from './locales/Buildings/ar.json';
import buildingsKu from './locales/Buildings/ku.json';

import vendorsEn from './locales/Vendors/en.json';
import vendorsAr from './locales/Vendors/ar.json';
import vendorsKu from './locales/Vendors/ku.json';

import themesEn from './locales/Themes/en.json';
import themesAr from './locales/Themes/ar.json';
import themesKu from './locales/Themes/ku.json';

import homeEn from './locales/Home/en.json';
import homeAr from './locales/Home/ar.json';
import homeKu from './locales/Home/ku.json';

import reportsEn from './locales/Reports/en.json';
import reportsAr from './locales/Reports/ar.json';
import reportsKu from './locales/Reports/ku.json';

import profileEn from './locales/Profile/en.json';
import profileAr from './locales/Profile/ar.json';
import profileKu from './locales/Profile/ku.json';

import productsEn from './locales/Products/en.json';
import productsAr from './locales/Products/ar.json';
import productsKu from './locales/Products/ku.json';
import supportTicketsEn from './locales/SupportTickets/en.json';
import supportTicketsAr from './locales/SupportTickets/ar.json';
import supportTicketsKu from './locales/SupportTickets/ku.json';
import historyEn from './locales/History/en.json';
import historyAr from './locales/History/ar.json';
import historyKu from './locales/History/ku.json';
import ordersEn from './locales/Orders/en.json';
import ordersAr from './locales/Orders/ar.json';
import ordersKu from './locales/Orders/ku.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      sidebar: sidebarEn,
      navbar: navbarEn,
      users: usersEn,
      buildings: buildingsEn,
      vendors: vendorsEn,
      themes: themesEn,
      home: homeEn,
      reports: reportsEn,
      profile: profileEn,
      products: productsEn,
      supportTickets: supportTicketsEn,
      history: historyEn,
      orders: ordersEn,
    },
    ar: {
      sidebar: sidebarAr,
      navbar: navbarAr,
      users: usersAr,
      buildings: buildingsAr,
      vendors: vendorsAr,
      themes: themesAr,
      home: homeAr,
      reports: reportsAr,
      profile: profileAr,
      products: productsAr,
      supportTickets: supportTicketsAr,
      history: historyAr,
      orders: ordersAr,
    },
    ku: {
      sidebar: sidebarKu,
      navbar: navbarKu,
      users: usersKu,
      buildings: buildingsKu,
      vendors: vendorsKu,
      themes: themesKu,
      home: homeKu,
      reports: reportsKu,
      profile: profileKu,
      products: productsKu,
      supportTickets: supportTicketsKu,
      history: historyKu,
      orders: ordersKu,
    },
  },
  lng: 'en', // default language
  fallbackLng: 'en',
  ns: [
    'sidebar',
    'navbar',
    'users',
    'buildings',
    'vendors',
    'themes',
    'home',
    'reports',
    'profile',
    'products',
    'supportTickets',
    'history',
    'orders',
  ],
  defaultNS: 'sidebar',
  interpolation: { escapeValue: false },
});

export default i18n;
