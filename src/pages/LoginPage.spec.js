import {render, screen, waitForElementToBeRemoved} from '../test/setup';
import LoginPage from "./LoginPage";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import en from "../locale/en.json";
import pl from "../locale/pl.json";

let requestBody, count = 0, acceptLanguageHeader;
const server = setupServer(
    rest.post('/api/1.0/auth', (req, res, ctx) => {
        requestBody = req.body;
        count += 1;
        acceptLanguageHeader = req.headers.get('Accept-Language');
        return res(ctx.status(401), ctx.json({message: 'Incorrect credentials'}));
    })
);

beforeEach(() => {
    count = 0;
    server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());


describe("LoginPage", () => {
    describe('Layout', () => {
        it("has header", () => {
            render(<LoginPage/>);
            const header = screen.queryByRole("heading", {name: "Login"});
            expect(header).toBeInTheDocument();
        });
        it("has email input", () => {
            render(<LoginPage/>);
            const input = screen.getByLabelText("E-mail");
            expect(input).toBeInTheDocument();
        });
        it("has password input", () => {
            render(<LoginPage/>);
            const input = screen.getByLabelText("Password");
            expect(input).toBeInTheDocument();
        });
        it("has password type for password input", () => {
            render(<LoginPage/>);
            const input = screen.getByLabelText("Password");
            expect(input.type).toBe("password");
        });
        it("has Login button", () => {
            render(<LoginPage/>);
            const button = screen.queryByRole("button", {name: "Login"});
            expect(button).toBeInTheDocument();
        });
        it("disables the button initially", () => {
            render(<LoginPage/>);
            const button = screen.queryByRole("button", {name: "Login"});
            expect(button).toBeDisabled();
        });
    });
    describe("Interactions", () => {
        let button, emailInput, passwordInput;
        const setup = () => {
            render(<LoginPage/>);
            emailInput = screen.getByLabelText("E-mail");
            passwordInput = screen.getByLabelText("Password");
            userEvent.type(emailInput, "user100@mail.com");
            userEvent.type(passwordInput, "P4ssword");
            button = screen.queryByRole("button", {name: "Login"});
        }
        it('enables the button when email and password inputs is filled', () => {
            setup();
            expect(button).toBeEnabled();
        });
        it('displays spinner during api call', async () => {
            setup();
            expect(screen.queryByRole("status")).not.toBeInTheDocument();
            await userEvent.click(button);
            const spinner = screen.getByRole("status");
            await waitForElementToBeRemoved(spinner);
        });
        it('sends email and password to backend after clicking the button', async () => {
            setup();
            await userEvent.click(button);
            const spinner = screen.getByRole("status");
            await waitForElementToBeRemoved(spinner);
            expect(requestBody).toEqual({
                email: "user100@mail.com",
                password: "P4ssword"
            });
        });
        it('disabled the button when there is an api call', async () => {
            setup();
            await userEvent.click(button);
            await userEvent.click(button);
            const spinner = screen.getByRole("status");
            await waitForElementToBeRemoved(spinner);
            expect(count).toEqual(1);
        });
        it('displays authentication fail message', async () => {
            setup();
            await userEvent.click(button);
            const errorMessage = await screen.findByText("Incorrect credentials");
            expect(errorMessage).toBeInTheDocument();
        });
        it('clears authentication fail message when email field is changed', async () => {
            setup();
            await userEvent.click(button);
            const errorMessage = await screen.findByText("Incorrect credentials");
            await userEvent.type(emailInput, "new@mail.com");
            expect(errorMessage).not.toBeInTheDocument();
        });
        it('clears authentication fail message when password field is changed', async () => {
            setup();
            await userEvent.click(button);
            const errorMessage = await screen.findByText("Incorrect credentials");
            await userEvent.type(passwordInput, "newP4ssword");
            expect(errorMessage).not.toBeInTheDocument();
        });
    });
    describe("Internationalization", () => {
        let polishToggle, englishToggle;
        const setup = () => {
            render(<LoginPage/>);
            polishToggle = screen.getByTitle("Polski");
            englishToggle = screen.getByTitle("English");
        };
        it("initiality displays all text in English", () => {
            setup();
            expect(
                screen.getByRole("heading", {name: en.login})
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", {name: en.login})
            ).toBeInTheDocument();
            expect(screen.getByLabelText(en.email)).toBeInTheDocument();
            expect(screen.getByLabelText(en.password)).toBeInTheDocument();
        });
        it("displays all text in Polish after changing the Language", async () => {
            await setup();
            await userEvent.click(polishToggle);

            expect(
                screen.getByRole("heading", {name: pl.login})
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", {name: pl.login})
            ).toBeInTheDocument();
            expect(screen.getByLabelText(pl.email)).toBeInTheDocument();
            expect(screen.getByLabelText(pl.password)).toBeInTheDocument();
        });
        it("sets accept language header to en for outgoing request", async () => {
            setup();
            const emailInput = screen.getByLabelText("E-mail");
            const passwordInput = screen.getByLabelText("Password");
            await userEvent.type(emailInput, "user100@mail.com");
            await userEvent.type(passwordInput, "P4ssword");
            const button = screen.queryByRole("button", {name: "Login"});
            await userEvent.click(button);
            const spinner = screen.getByRole("status");
            await waitForElementToBeRemoved(spinner);
            expect(acceptLanguageHeader).toBe("en");
        });
        it("sets accept language header to pl for outgoing request", async () => {
            setup();
            const emailInput = screen.getByLabelText("E-mail");
            const passwordInput = screen.getByLabelText("Password");
            await userEvent.type(emailInput, "user100@mail.com");
            await userEvent.type(passwordInput, "P4ssword");
            const button = screen.queryByRole("button", {name: "Login"});
            await userEvent.click(polishToggle);
            await userEvent.click(button);
            const spinner = screen.getByRole("status");
            await waitForElementToBeRemoved(spinner);
            expect(acceptLanguageHeader).toBe("pl");
        });
    });
});

console.error = () => {};
