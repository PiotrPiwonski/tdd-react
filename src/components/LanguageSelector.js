import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = (props) => {
    const { i18n } = useTranslation();
    return (
        <div>
            <img
                src="https://flagsapi.com/PL/flat/24.png"
                title="Polski"
                onClick={() => i18n.changeLanguage('pl')}
                alt="Polish flag"
            />
            <img
                src="https://flagsapi.com/GB/flat/24.png"
                title="English"
                onClick={() => i18n.changeLanguage('en')}
                alt="English flag"
            />
        </div>

    )
}

export default LanguageSelector;