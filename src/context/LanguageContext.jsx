import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // Default to Hebrew

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "he" : "en"));
  };

  const translations = {
    he: {
      heroTitle: "חליפות יוקרה מותאמות",
      heroSubtitle:
        "נוצרות בדיוק, מעוצבות להבדלה. חווה חליפות מותאמות שמשלבות מורשת איטלקית עם תחכום מודרני.",
      designButton: "צור חליפה שלך",
      scrollDown: "גלול למטה",
      mostPopular: "הכי נמכר",
      mostPopularSubtitle:
        "העיצובים האהובים ביותר שלנו, נבחרו על ידי לקוחות מפוכחים בזכות האיכות יוצאת הדופן והקסם הנצחי שלהם.",
      orderSuitsTitle: "חליפות מהזמנות שלך",
      orderSuitsSubtitle:
        "גלריית חליפות מהזמנות - תוכל לעשות לייק לחליפות האהובות עליך",
      likeButton: "לייק",
      likedButton: "אהבתי",
      loadingSuits: "טוען חליפות...",
      noSuitsFound: "לא נמצאו חליפות מהזמנות",
      noSuitsMessage: "הזמן חליפה כדי לראות אותה כאן",
      stopRotation: "עצור רוטציה",
      startRotation: "התחל רוטציה",
      artOfTailoringText:
        "כל חליפה היא יצירת מופת של חייטות איטלקית, שם עשרות שנים של מומחיות פוגשות דיוק עכשווי. מבחירת בדים יוקרתיים ועד פרטי גימור ידניים, אנו יוצרים בגדים שמגדירים מצוינות.",
      ourProcess: "המלאכה שלנו",
      ourCollections: "קולקציות",
      collectionsSubtitle:
        "גלה את הטווח המעוצב שלנו של חליפות שתוכננו לכל אירוע וסגנון אישי.",
      languageButton: "EN",
      // NavBar translations
      home: "בית",
      customSuit: "חליפה מותאמת",
      about: "אודות",
      contact: "צור קשר",
      sizeGuide: "מדריך מידות",
      support: "תמיכה",
      account: "חשבון",
      shoppingBag: "סל קניות",
      // About page translations
      returnToMain: "חזור לדף הראשי",
      ourHeritage: "המורשת שלנו",
      italianCraftsmanship: "מלאכת יד איטלקית מאז 1957",
      aboutParagraph1:
        "נוסד בשנת 1957, בית המלאכה האיטלקי שלנו לחליפות היה סמל לאלגנטיות נצחית ומלאכת יד יוצאת דופן במשך למעלה משישה עשורים. ממוקם בלב איטליה, אנו גאים לעצב ולחייט חליפות איכותיות המשלבות מסורת עם תחכום מודרני.",
      aboutParagraph2:
        "כל חליפה נוצרת בדיוק על ידי אומנים מיומנים המשתמשים בבדים האיטלקיים המשובחים ביותר, מבטיחה התאמה מושלמת ונוחות חסרת תחרות. בין אם אתם מחפשים חליפת עסקים קלאסית, טוקסידו אלגנטי, או יצירת מופת מותאמת אישית, הקולקציה שלנו מציעה מגוון רחב של עיצובים המתאימים לכל אירוע.",
      artOfTailoring: "אמנות החייטות",
      aboutParagraph3:
        "המחויבות שלנו למצוינות ותשומת הלב לפרטים הפכו אותנו לשם מהימן באופנת גברים, מושכים לקוחות מכל העולם. אנו מאמינים שחליפה מחויטת היטב היא יותר מאשר רק בגד - זה הצהרה של ביטחון, סגנון ומסורת.",
      aboutParagraph4:
        "כל בגד עובר דרך ידיהם של לפחות 16 אומנים מומחים, ממעצבי דפוסים ועד מומחי כפתורים. אנו שומרים על הטכניקות המסורתיות שהועברו מדור לדור, מבטיחים שכל תפר תורם הן למשיכה האסתטית והן לשלמות המבנית של היצירה הסופית.",
      aboutQuote:
        "בקרו אותנו וחוו את מהות החייטות האיטלקית, שם איכות פוגשת מורשת, וכל חליפה מספרת סיפור של מלאכת יד ומסורת.",
      // Contact page translations
      contactUs: "צור קשר",
      sendUsMessage: "שלח לנו הודעה",
      contactDescription:
        "נשמח לשמוע ממך. אנא מלא את הטופס למטה ונחזור אליך בהקדם האפשרי.",
      fullName: "שם מלא",
      emailAddress: "כתובת מייל",
      subject: "נושא",
      message: "הודעה",
      sendMessage: "שלח הודעה",
      contactInformation: "פרטי קשר",
      address: "כתובת",
      phone: "טלפון",
      email: "מייל",
      openingHours: "שעות פתיחה",
      returnToMainPage: "חזור לדף הראשי",
    },
    en: {
      heroTitle: "Luxury Tailored Suits",
      heroSubtitle:
        "Crafted with precision, designed for distinction. Experience bespoke suits that blend Italian heritage with modern sophistication.",
      designButton: "Create Your Suit",
      scrollDown: "SCROLL DOWN",
      mostPopular: "Bestsellers",
      mostPopularSubtitle:
        "Our most loved designs, chosen by discerning clients for their exceptional quality and timeless appeal.",
      orderSuitsTitle: "Your Order Suits",
      orderSuitsSubtitle:
        "Gallery of suits from your orders - you can like your favorite suits",
      likeButton: "Like",
      likedButton: "Liked",
      loadingSuits: "Loading suits...",
      noSuitsFound: "No suits found from orders",
      noSuitsMessage: "Order a suit to see it here",
      stopRotation: "Stop Rotation",
      startRotation: "Start Rotation",
      artOfTailoring: "Master Craftsmanship",
      artOfTailoringText:
        "Every suit is a masterpiece of Italian tailoring, where decades of expertise meet contemporary precision. From premium fabric selection to hand-finished details, we create garments that define excellence.",
      ourProcess: "Our Craft",
      ourCollections: "Collections",
      collectionsSubtitle:
        "Discover our curated range of suits designed for every occasion and personal style.",
      languageButton: "עב",
      // NavBar translations
      home: "Home",
      customSuit: "Custom Suit",
      about: "About",
      contact: "Contact",
      sizeGuide: "Size Guide",
      support: "Support",
      account: "Account",
      shoppingBag: "Shopping Bag",
      // About page translations
      returnToMain: "Return to Main Page",
      ourHeritage: "Our Heritage",
      italianCraftsmanship: "Italian Suit Craftsmanship Since 1957",
      aboutParagraph1:
        "Founded in 1957, our Italian suit atelier has been a symbol of timeless elegance and exceptional craftsmanship for over six decades. Located in the heart of Italy, we take pride in designing and tailoring high-quality suits that blend tradition with modern sophistication.",
      aboutParagraph2:
        "Each suit is crafted with precision by skilled artisans using the finest Italian fabrics, ensuring a perfect fit and unparalleled comfort. Whether you're looking for a classic business suit, a stylish tuxedo, or a custom-made masterpiece, our collection offers a wide range of designs to suit every occasion.",
      aboutParagraph3:
        "Our commitment to excellence and attention to detail have made us a trusted name in men's fashion, attracting clients from around the world. We believe that a well-tailored suit is more than just clothing—it's a statement of confidence, style, and tradition.",
      aboutParagraph4:
        "Each garment passes through the hands of at least 16 specialized artisans, from pattern makers to button specialists. We maintain the traditional techniques that have been passed down through generations, ensuring that every stitch contributes to both the aesthetic appeal and structural integrity of the final piece.",
      aboutQuote:
        "Visit us and experience the essence of Italian tailoring, where quality meets heritage, and every suit tells a story of craftsmanship and tradition.",
      // Contact page translations
      contactUs: "Contact Us",
      sendUsMessage: "Send Us a Message",
      contactDescription:
        "We'd love to hear from you. Please fill out the form below and we'll get back to you as soon as possible.",
      fullName: "Full Name",
      emailAddress: "Email Address",
      subject: "Subject",
      message: "Message",
      sendMessage: "Send Message",
      contactInformation: "Contact Information",
      address: "Address",
      phone: "Phone",
      email: "Email",
      openingHours: "Opening Hours",
      returnToMainPage: "Return to Main Page",
    },
  };

  const t = (key) => {
    // console.log(`Translating key: ${key}, language: ${language}`);
    const translation = translations[language][key];
    // console.log(`Translation result:`, translation);
    if (!translation) {
      console.warn(
        `Missing translation for key: ${key} in language: ${language}`
      );
    }
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
