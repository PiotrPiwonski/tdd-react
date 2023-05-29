import SingUpPage from './SingUpPage';
import {render, screen} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
// import axios from "axios";
import { setupServer } from "msw/node";
import { rest } from "msw";
// import resolve from "resolve";

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
        });
        it("sends username, email and password to backend after clicking the button", async () => {
            let requestBody;
            const server = setupServer(
                rest.post("/api/1.0/users", (req, res, ctx) => {
                    requestBody = req.body;
                    return res(ctx.status(200))
                })
            );
            server.listen();

            render(<SingUpPage/>);
            const usernameInput = screen.getByLabelText("Username");
            const emailInput = screen.getByLabelText("E-mail");
            const passwordInput = screen.getByLabelText("Password");
            const passwordRepeatInput = screen.getByLabelText("Password Repeat");
            userEvent.type(usernameInput, "user1");
            userEvent.type(emailInput, "user1@mail.com");
            userEvent.type(passwordInput, "P4ssword");
            userEvent.type(passwordRepeatInput, "P4ssword");
            const button = screen.queryByRole("button", {name: "Sing Up"});

            userEvent.click(button);

            //const mockFn = jest.fn();
            // axios.post = mockFn; // for axios
            // window.fetch = mockFn;
            // userEvent.click(button);
            // const firstCallOfMockFunction = mockFn.mock.calls[0];
            // const body = firstCallOfMockFunction[1]; // for axios
            // const body = JSON.parse(firstCallOfMockFunction[1].body);
            // expect(body).toEqual({
            //     username: "user1",
            //     email: "user1@mail.com",
            //     password: "P4ssword",
            // });

            await new Promise((resolve) => setTimeout(resolve, 500));

            expect(requestBody).toEqual({
                username: "user1",
                email: "user1@mail.com",
                password: "P4ssword",
            });

        });

    });
});
