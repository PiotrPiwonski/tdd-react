import SingUpPage from './SingUpPage';
import {render, screen} from '@testing-library/react';

describe('Sing Up Page', () => {
    describe('Layout', () => {
        it("has header", () => {
            render(<SingUpPage/>);
            const header = screen.queryByRole("heading", {name: "Sing Up"});
            expect(header).toBeInTheDocument();
        });
        it("has username input", () => {
            render(<SingUpPage/>);
            const input = screen.getByLabelText("Username");
            expect(input).toBeInTheDocument();
        });
        it("has email input", () => {
            render(<SingUpPage/>);
            const input = screen.getByLabelText("E-mail");
            expect(input).toBeInTheDocument();
        });
        it("has password input", () => {
            render(<SingUpPage/>);
            const input = screen.getByLabelText("Password");
            expect(input).toBeInTheDocument();
        });
        it("has password type for password input", () => {
            render(<SingUpPage/>);
            const input = screen.getByLabelText("Password");
            expect(input.type).toBe("password");
        });
        it("has password repeat input", () => {
            render(<SingUpPage/>);
            const input = screen.getByLabelText("Password Repeat");
            expect(input).toBeInTheDocument();
        });
        it("has password type for password repeat input", () => {
            render(<SingUpPage/>);
            const input = screen.getByLabelText("Password Repeat");
            expect(input.type).toBe("password");
        });
        it("has Sing Up button", () => {
            render(<SingUpPage/>);
            const button = screen.queryByRole("button", {name: "Sing Up"});
            expect(button).toBeInTheDocument();
        });
        it("disables the button initially", () => {
            render(<SingUpPage/>);
            const button = screen.queryByRole("button", {name: "Sing Up"});
            expect(button).toBeDisabled();
        });
    });
});
