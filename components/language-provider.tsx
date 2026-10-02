'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ha';

type Dict = Record<string, string>;

const en: Dict = {
  'nav.home': 'Home',
  'nav.services': 'Services',
  'nav.request': 'Request Pickup',
  'nav.about': 'About',
  'nav.pricing': 'Pricing',
  'nav.contact': 'Contact',
  'nav.admin': 'Admin',
  'cta.request': 'Request Pickup',
  'cta.whatsapp': 'WhatsApp Us',
  'hero.title': 'You Have Waste? CleanBin Comes to You.',
  'hero.subtitle': 'Convenient waste collection from homes, shops, compounds, and local areas. Request a pickup and our team comes to you.',
  'hero.cta': 'Request Waste Pickup',
  'hero.cta2': 'Chat on WhatsApp',
  'about.title': 'About CleanBin',
  'about.desc': 'We bridge the gap between waste generators and collection teams, making waste management simple, accessible, and technology-driven.',
  'why.title': 'Why Choose Us',
  'why.1.title': 'Fast Response',
  'why.1.desc': 'Submit a request and our team contacts you quickly to arrange pickup.',
  'why.2.title': 'Professional Service',
  'why.2.desc': 'Trained collection teams handle your waste responsibly and efficiently.',
  'why.3.title': 'Affordable Pricing',
  'why.3.desc': 'Transparent pricing for every budget, from small pickups to large contracts.',
  'why.4.title': 'Coverage Across Kano',
  'why.4.desc': 'We serve all 44 Local Government Areas in Kano State.',
  'how.title': 'How It Works',
  'how.1': 'Submit Request',
  'how.1.desc': 'Fill out the pickup request form with your details and waste information.',
  'how.2': 'We Review',
  'how.2.desc': 'Our admin team reviews your request and contacts you to confirm details.',
  'how.3': 'Team Dispatched',
  'how.3.desc': 'A collection team is assigned and dispatched to your location.',
  'how.4': 'Waste Collected',
  'how.4.desc': 'Your waste is removed and the request is marked as completed.',
  'services.title': 'Our Services',
  'services.subtitle': 'Comprehensive waste collection services for every need.',
  'pricing.title': 'Simple, Transparent Pricing',
  'pricing.subtitle': 'Pricing varies depending on volume and location.',
  'contact.title': 'Get in Touch',
  'contact.subtitle': 'Have questions? We are here to help.',
  'footer.about': 'CleanBin is a digital waste collection and environmental services platform serving communities across Kano State.',
  'footer.links': 'Quick Links',
  'footer.services': 'Services',
  'footer.contact': 'Contact Us',
  'footer.rights': 'All rights reserved.',
  'form.name': 'Full Name',
  'form.phone': 'Phone Number',
  'form.address': 'Address',
  'form.lga': 'Local Government Area',
  'form.wasteType': 'Waste Type',
  'form.quantity': 'Estimated Waste Quantity',
  'form.date': 'Preferred Collection Date',
  'form.time': 'Preferred Collection Time',
  'form.photo': 'Photo Upload',
  'form.notes': 'Additional Notes',
  'form.submit': 'Submit Request',
  'form.success': 'Your request has been submitted successfully! We will contact you soon.',
  'form.error': 'Something went wrong. Please try again.',
  'form.selectLga': 'Select your LGA',
  'form.selectWasteType': 'Select waste type',
  'form.selectQuantity': 'Select quantity',
  'form.selectTime': 'Select time',
};

const ha: Dict = {
  'nav.home': 'Gida',
  'nav.services': 'Ayyuka',
  'nav.request': 'Nema Tattarawa',
  'nav.about': 'Game da Mu',
  'nav.pricing': 'Farashi',
  'nav.contact': 'Tuntuɓar',
  'nav.admin': 'Admin',
  'cta.request': 'Nema Tattarawa',
  'cta.whatsapp': 'WhatsApp Mu',
  'hero.title': 'Kana Da Shara? CleanBin Yana Zuwa Wurinka.',
  'hero.subtitle': 'Saurin tattarawar shara daga gida, shaguna, lambuna, da yankunan gida. Ka nema tattarawa, ƙungiyarmu za ta zo wurinka.',
  'hero.cta': 'Nema Tattarawar Shara',
  'hero.cta2': 'Yi Magana A WhatsApp',
  'about.title': 'Game da CleanBin',
  'about.desc': 'Muna gada tsakanin masu samar da shara da ƙungiyoyin tattarawa, mu sa kula da shara zama mai sauƙi da fasaha.',
  'why.title': 'Me ya sa Zaɓe Mu',
  'why.1.title': 'Saurin Amsa',
  'why.1.desc': 'Ka gabatar da buƙata, ƙungiyarmu za ta tuntuɓe ka cikin sauri.',
  'why.2.title': 'Ayyuka na Ƙwararru',
  'why.2.desc': 'Ƙungiyoyin tattarawa da aka horar suna kula da shararka da kyau.',
  'why.3.title': 'Farashi mai Kyau',
  'why.3.desc': 'Faraskewa bayyane don kowane kasafin, daga ƙarami zuwa babba.',
  'why.4.title': 'A duk Jihar Kano',
  'why.4.desc': 'Muna bautarwa ga dukkan ƙananan hukumomi 44 a Jihar Kano.',
  'how.title': 'Yadda Ake Aikata',
  'how.1': 'Gabatar da Bukata',
  'how.1.desc': 'Cika fom ɗin neman tattarawa da bayananka da bayanin shara.',
  'how.2': 'Muna Nazari',
  'how.2.desc': 'Ƙungiyar admin ɗin mu za ta nazarin buƙatarka kuma ta tuntuɓe ka.',
  'how.3': 'An Aiko Ƙungiya',
  'how.3.desc': 'An raba ƙungiyar tattarawa aka aiko zuwa wurinka.',
  'how.4': 'An Tattara Shara',
  'how.4.desc': 'An cire sharan kuma an yi alama buƙata a matsayin an kammala.',
  'services.title': 'Ayyukan Mu',
  'services.subtitle': 'Cikakken ayyukan tattarawar shara don kowane buƙata.',
  'pricing.title': 'Farashi Mai Sauƙi kuma Bayyane',
  'pricing.subtitle': 'Farashi ya danganta da yawa da wuri.',
  'contact.title': 'Tuntuɓar Mu',
  'contact.subtitle': 'Kana da tambaya? Muna nan don taimako.',
  'footer.about': 'CleanBin tsari ne na dijital don tattarawar shara da ayyukan muhalli a Jihar Kano.',
  'footer.links': 'Hanyoyi masu Sauƙi',
  'footer.services': 'Ayyuka',
  'footer.contact': 'Tuntuɓar Mu',
  'footer.rights': 'Dukkan haƙƙoƙi an tsare.',
  'form.name': 'Cikakken Suna',
  'form.phone': 'Lambar Waya',
  'form.address': 'Adreshi',
  'form.lga': 'Karamar Hukuma',
  'form.wasteType': "Nau'in Shara",
  'form.quantity': 'Kiyasin Yawan Shara',
  'form.date': 'Ranar Da Ka Fi So',
  'form.time': 'Lokacin Da Ka Fi So',
  'form.photo': 'Sanya Hoto',
  'form.notes': 'Ƙarin Bayani',
  'form.submit': 'Gabatar da Bukata',
  'form.success': 'An gabatar da buƙatarka cikin nasara! Za mu tuntuɓe ka nan ba.',
  'form.error': 'Wani abu ya same. Da fatan za a sake gwadawa.',
  'form.selectLga': 'Zaɓi Karamar Hukumarka',
  'form.selectWasteType': "Zaɓi nau'in shara",
  'form.selectQuantity': 'Zaɓi yawa',
  'form.selectTime': 'Zaɓi lokaci',
};

const dictionaries: Record<Language, Dict> = { en, ha };

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('cleanbin-lang') as Language | null;
    if (saved === 'en' || saved === 'ha') {
      setLangState(saved);
    }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('cleanbin-lang', l);
  };

  const t = (key: string) => dictionaries[lang][key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
