import { useEffect, useRef, useState } from 'react';
import { languages } from '../languagesData';

const TranslatorApp = ({ onClose }) => {
    const [selectedLanguageFrom, setSelectedLanguageFrom] = useState('English');
    const [selectedLanguageTo, setSelectedLanguageTo] = useState('Turkish');
    const [showLanguages, setShowLanguages] = useState(false);
    const [currentLanguageSelection, setCurrentLanguageSelection] = useState(null);
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [characterCount, setCharacterCount] = useState(0);
    const maxCharacters = 200;
    const dropDownRef = useRef(null);

    useEffect(() => {
        if (showLanguages) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLanguages]);

    const handleClickOutside = (e) => {
        if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
            setShowLanguages(false);
        }
    };

    const handleLanguageClick = (type) => {
        setCurrentLanguageSelection(type);
        setShowLanguages(true);
    };

    const handleLanguageSelect = (language) => {
        if (currentLanguageSelection === 'from') {
            setSelectedLanguageFrom(language);
        } else {
            setSelectedLanguageTo(language);
        }
        setShowLanguages(false);
    };

    const handleSwapLanguages = () => {
        setSelectedLanguageFrom(selectedLanguageTo);
        setSelectedLanguageTo(selectedLanguageFrom);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= maxCharacters) {
            setInputText(value);
            setCharacterCount(value.length);
        }
    };

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            setTranslatedText('');
            return;
        }

        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${selectedLanguageFrom}|${selectedLanguageTo}`
        );
        const data = await response.json();
        setTranslatedText(data.responseData.translatedText);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleTranslate();
        }
    };

    return (
        <div className="w-full flex flex-col gap-y-4 justify-center items-center px-6 sm:px-8 pt-12 pb-6 relative">
            <button className="absolute top-4 right-4" onClick={onClose}>
                <i className="fa-solid fa-xmark text-xl text-gray-300"></i>
            </button>

            <div className="w-full min-h-20 flex justify-center items-center px-4 bg-gradient-to-r from-[#b6f492] to-[#338b93] text-gray-700 rounded-lg">
                <div className="language" onClick={() => handleLanguageClick('from')}>
                    {selectedLanguageFrom || 'English'}
                </div>
                <i className="fa-solid fa-arrows-rotate text-2xl mx-8 cursor-pointer" onClick={handleSwapLanguages}></i>
                <div className="language" onClick={() => handleLanguageClick('to')}>
                    {selectedLanguageTo || 'Turkish'}
                </div>
            </div>

            {showLanguages && (
                <div
                    className="w-[calc(100%-4rem)] h-[calc(100%-9rem)] overflow-y-scroll my-2 bg-gradient-to-r from-[#b6f492] to-[#338b93] absolute top-32 left-8 z-10 rounded shadow-lg p-4 scroolbar-hide"
                    ref={dropDownRef}
                >
                    <ul>
                        {Object.entries(languages).map(([code, name]) => (
                            <li
                                key={code}
                                className="cursor-pointer hover:bg-[#10646b] transition duration-200 p-2 rounded"
                                onClick={() => handleLanguageSelect(name)}
                            >
                                {name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="w-full relative">
                <textarea
                    value={inputText || ''}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="textarea text-gray-200"
                ></textarea>
                <div className="absolute bottom-2 right-4 text-gray-400">
                    {characterCount}/{maxCharacters}
                </div>
            </div>

            <button
                className="w-12 h-12 bg-gradient-to-r from-[#b6f492] to-[#338b93] rounded-full text-2xl text-gray-600 flex justify-center items-center active:translate-y-[1px]"
                onClick={handleTranslate}
            >
                <i className="fa-solid fa-chevron-down"></i>
            </button>

            <div className="w-full">
                <textarea
                    value={translatedText || ''}
                    readOnly
                    className="textarea text-[#b6f492]"
                ></textarea>
            </div>
        </div>
    );
};

export default TranslatorApp;
