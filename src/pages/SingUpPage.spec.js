import SingUpPage from './SingUpPage';
import {render, screen} from '@testing-library/react';
import userEvent from "@testing-library/user-event";

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
    describe("Interactions", () => {
        it("enables the button when password and password repeat fields have the same value", () => {
            render(<SingUpPage/>);
            const passwordInput = screen.getByLabelText("Password");
            const passwordRepeatInput = screen.getByLabelText("Password Repeat");
            userEvent.type(passwordInput, "P4ssword");
            userEvent.type(passwordRepeatInput, "P4ssword");
            const button = screen.queryByRole("button", {name: "Sing Up"});
            expect(button).toBeEnabled();
        })
    })
});
