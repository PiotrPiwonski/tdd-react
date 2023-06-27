import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthContextWrapper from "../state/AuthContextWrapper";
import LanguageSelector from "../components/LanguageSelector";

const RootWrapper = ({ children }) => {
    return (
        <Router>
            <AuthContextWrapper>
                {children}
                <LanguageSelector/>
            </AuthContextWrapper>
        </Router>
    );
};

const customRender = (ui, options) =>
    render(ui, { wrapper: RootWrapper, ...options });

export * from '@testing-library/react';

export { customRender as render };