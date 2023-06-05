import SingUpPage from './SingUpPage';
import {render, screen, waitFor, waitForElementToBeRemoved} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
// import axios from "axios";
import { setupServer } from "msw/node";
import { rest } from "msw";
// import resolve from "resolve";

let requestBody;
let counter = 0;
let acceptLanguageHeader;
const server = setupServer(
    rest.post('/api/1.0/users', (req, res, ctx) => {
        requestBody = req.body;
        counter += 1;
        // acceptLanguageHeader = req.headers.get('Accept-Language');
        return res(ctx.status(200));
    })
);

beforeEach(() => {
    counter = 0;

    server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

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
        let button;
        const setup = () => {
            render(<SingUpPage/>);
            const usernameInput = screen.getByLabelText("Username");
            const emailInput = screen.getByLabelText("E-mail");
            const passwordInput = screen.getByLabelText("Password");
            const passwordRepeatInput = screen.getByLabelText("Password Repeat");
            userEvent.type(usernameInput, "user1");
            userEvent.type(emailInput, "user1@mail.com");
            userEvent.type(passwordInput, "P4ssword");
            userEvent.type(passwordRepeatInput, "P4ssword");
            button = screen.queryByRole("button", {name: "Sing Up"});
        }
        it("enables the button when password and password repeat fields have the same value", () => {
            setup();
            expect(button).toBeEnabled();
        });
        it("sends username, email and password to backend after clicking the button", async () => {

            setup();

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

            await screen.findByText('Please check your e-mail to activate your account');

            expect(requestBody).toEqual({
                username: "user1",
                email: "user1@mail.com",
                password: "P4ssword",
            });
        });
        it("disables button when is an ongoing api call", async () => {

            setup();

            userEvent.click(button);
            // userEvent.click(button);

            await screen.findByText('Please check your e-mail to activate your account');
            expect(counter).toBe(1);
        });
        it("displays spinner after clicking the submit", async () => {
            setup();
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
            userEvent.click(button);

            // const spinner = screen.getByRole('status');
            // expect(spinner).toBeInTheDocument();
            await screen.findByText('Please check your e-mail to activate your account');
        });
        it("displays account activation notification after success sing up request", async () => {
            setup();
            const massage = 'Please check your e-mail to activate your account';
            expect(screen.queryByText(massage)).not.toBeInTheDocument();
            userEvent.click(button);
            const text = await screen.findByText(massage);
            expect(text).toBeInTheDocument();
        });
        it("hides sing up form after success sing up request", async () => {
            setup();
            const form = screen.getByTestId('form-sing-up');
            userEvent.click(button);
            // await waitFor(() => {
            //     expect(form).not.toBeInTheDocument();
            // });
            await waitForElementToBeRemoved(form);
        });

        const generateValidationError = (field, message) => {
            return rest.post('/api/1.0/users', (req, res, ctx) => {
                return res(ctx.status(400), ctx.json({
                    validationErrors: { [field]: message }
                }));
            });
        }

        it.each`
        field         | message
        ${"username"} | ${"Username cannot be null"}
        ${"email"}    | ${"E-mail cannot be null"}
        ${"password"} | ${"Password cannot be null"}
        `("displays $message for $field", async ({field, message}) => {
            server.use(generateValidationError(field, message));
            setup();
            userEvent.click(button);
            const validationError =  await screen.findByText(message);
            expect(validationError).toBeInTheDocument();
        });

        it("hides spinner and enables button after response received", async () => {
            server.use(generateValidationError("username", "Username cannot be null"));
            setup();
            userEvent.click(button);
            await screen.findByText('Username cannot be null');
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
            expect(button).toBeEnabled();

        });

    });
});
