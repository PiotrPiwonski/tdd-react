import { render, screen} from "./test/setup";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import storage from "./state/storage";

let logoutCount = 0;
let header;
const server = setupServer(
    rest.post('/api/1.0/users/token/:token', (req, res, ctx) => {
        return res(ctx.status(200));
    }),
    rest.get('/api/1.0/users', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(
            {
                content: [
                    {
                        id: 1,
                        username: "user-in-list",
                        email: "user-in-list@mail.com",
                        image: null
                    }
                ],
                page: 0,
                size: 0,
                totalPages: 0
            }
        ));
    }),
    rest.get("/api/1.0/users/:id", (req, res, ctx) => {
        header = req.headers.get('Authorization');
        const id = Number.parseInt(req.params.id);
        if (id === 1) {
            return res(ctx.json({
                id: 1,
                username: "user-in-list",
                email: "user-in-list@mail.com",
                image: null
            })
            );
        }
        return res(
            ctx.json({
                id: id,
                username: 'user'+id,
                email: 'user'+id+'@mail.com',
                image: null
            })
        );
    }),
    rest.post('/api/1.0/auth', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            id: 5,
            username: "user5"
        }));
    }),
    rest.post('/api/1.0/logout', (req, res, ctx) => {
        logoutCount += 1;
        return res(ctx.status(200));
    }),
    rest.delete('/api/1.0/users/:id', (req, res, ctx) => {
        return res(ctx.status(200));
    })
);

beforeEach(() => {
    logoutCount = 0;
    server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

const setup = (path) => {
    window.history.pushState({}, "", path);
    render(<App />);
}

describe("Routing", () => {

    it.each`
    path                | pageTestId
    ${'/'}              | ${'home-page'}
    ${'/signup'}        | ${'signup-page'}    
    ${'/login'}         | ${'login-page'}    
    ${'/user/1'}        | ${'user-page'}    
    ${'/user/2'}        | ${'user-page'}  
    ${'/activate/123'}  | ${'activation-page'}  
    ${'/activate/456'}  | ${'activation-page'}  
    `("displays $pageTestId when is $path", ({path, pageTestId}) => {
        setup(path);
        const page = screen.queryByTestId(pageTestId);
        expect(page).toBeInTheDocument();
    });

    it.each`
    path               | pageTestId
    ${'/'}             | ${'signup-page'}
    ${'/'}             | ${'login-page'}
    ${'/'}             | ${'user-page'}
    ${'/'}             | ${'activation-page'}
    ${'/signup'}       | ${'home-page'}    
    ${'/signup'}       | ${'login-page'}    
    ${'/signup'}       | ${'user-page'}    
    ${'/signup'}       | ${'activation-page'}    
    ${'/login'}        | ${'home-page'}    
    ${'/login'}        | ${'signup-page'}    
    ${'/login'}        | ${'user-page'}    
    ${'/login'}        | ${'activation-page'}    
    ${'/user/1'}       | ${'home-page'}    
    ${'/user/1'}       | ${'signup-page'}    
    ${'/user/1'}       | ${'login-page'}    
    ${'/user/1'}       | ${'activation-page'}  
    ${'/activate/123'} | ${'home-page'}    
    ${'/activate/123'} | ${'signup-page'}    
    ${'/activate/123'} | ${'login-page'}    
    ${'/activate/123'} | ${'user-page'}    
    `("does not display $pageTestId when is $path", ({path, pageTestId}) => {
        setup(path);
        const page = screen.queryByTestId(pageTestId);
        expect(page).not.toBeInTheDocument();
    });

    it.each`
    targetPage
    ${'logo Home'}
    ${'Sign Up'}
    ${'Login'}
    `("has link to $targetPage on NavBar", ({targetPage}) => {
        setup('/');
        const link = screen.getByRole('link', {name: targetPage});
        expect(link).toBeInTheDocument();
    });

    it.each`
    initialPath | clickingTo  | visiblePage
    ${'/'}      | ${'Sign Up'}| ${'signup-page'}
    ${'/signup'}| ${'logo Home'}   | ${'home-page'}
    ${'/signup'}| ${'Login'}   | ${'login-page'}
    `("displays $visiblePage afer clicking $clickingTo ", async ({initialPath, clickingTo, visiblePage}) => {
        setup(initialPath);
        const link = screen.getByRole('link', {name: clickingTo});
        await userEvent.click(link);
        expect(screen.getByTestId(visiblePage)).toBeInTheDocument();
    });

    it('displays home page when clicking brand logo',  async () => {
        setup('/login');
        const logo = screen.queryByAltText("logo");
        await userEvent.click(logo);
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
    it("navigates to user page when clicking the username on user list", async () => {
        setup('/');
        const user = await screen.findByText("user-in-list");
        userEvent.click(user);
        const page = await screen.findByTestId("user-page");
        expect(page).toBeInTheDocument();
    });
});

describe('Login', () => {
    const setupLoggedIn = async () => {
        setup('/login');
        await userEvent.type(screen.getByLabelText("E-mail"), "user5@mail.com");
        await userEvent.type(screen.getByLabelText("Password"), "P4ssword");
        await userEvent.click(screen.getByRole("button", {name: "Login"}));
    }
    it('redirects to homepage after successful login', async () => {
        await setupLoggedIn();
        const page = await screen.findByTestId("home-page");
        expect(page).toBeInTheDocument();
    });
    it('hides login and singup from navbar after successful login', async () => {
        await setupLoggedIn();
        await screen.findByTestId("home-page");
        const loginLink = screen.queryByRole("link", {name: "Login"});
        const singUpLink = screen.queryByRole("link", {name: "Sing Up"});
        expect(loginLink).not.toBeInTheDocument();
        expect(singUpLink).not.toBeInTheDocument();
    });
    it('displays My Profile link on navbar after successful login', async () => {
        setup('/login');
        const myProfileLinkBeforeLogin = screen.queryByRole("link", {name: "My Profile"});
        expect(myProfileLinkBeforeLogin).not.toBeInTheDocument();
        await userEvent.type(screen.getByLabelText("E-mail"), "user5@mail.com");
        await userEvent.type(screen.getByLabelText("Password"), "P4ssword");
        await userEvent.click(screen.getByRole("button", {name: "Login"}));
        await screen.findByTestId("home-page");
        const myProfileLinkAfterLogin = screen.queryByRole("link", {name: "My Profile"});
        expect(myProfileLinkAfterLogin).toBeInTheDocument();
    });
    it('displays user page with logged in user id in url after clicking My Profile link', async () => {
        await setupLoggedIn();
        await screen.findByTestId("home-page");
        const myProfile = screen.queryByRole("link", {name: "My Profile"});
        await userEvent.click(myProfile);
        await screen.findByTestId("user-page");
        const username = await screen.findByText("user5");
        expect(username).toBeInTheDocument();
    });
    it('stores logged in state in local storage', async () => {
        await setupLoggedIn();
        await screen.findByTestId("home-page");
        const state = storage.getItem("auth");
        expect(state.isLoggedIn).toBeTruthy();
    });
    it('displays layout of logged in state', async () => {
        storage.setItem('auth', {isLoggedIn: true});
        await setup("/");
        const myProfileLink = screen.queryByRole("link", {name: "My Profile"});
        expect(myProfileLink).toBeInTheDocument();
    });
    it('refreshes user page from another user to teh logged in user after clicking MY Profile', async () => {
        storage.setItem('auth', {id: 5, username: "user5", isLoggedIn: true});
        await setup("/");
        const user = await screen.findByText("user-in-list");
        await userEvent.click(user);
        await screen.findByRole("heading", {name: "user-in-list"});
        const myProfileLink = screen.queryByRole("link", {name: "My Profile"});
        userEvent.click(myProfileLink);
        const user5 = await screen.findByRole("heading", {name: "user5"});
        expect(user5).toBeInTheDocument();
    });
});

describe("Logout", () => {

    let logoutLink;
    const setupLoggedIn = async () => {
        storage.setItem('auth',
            {id: 5, username: "user5", isLoggedIn: true, header: "auth header value"});
        await setup("/");
        logoutLink = screen.queryByRole("link", {name: "Logout"});
    }
    it('displays Logout on navbar after successful login', async () => {
        await setupLoggedIn();
        expect(logoutLink).toBeInTheDocument();
    });
    it('displays login and sing up on navbar after clicking logout', async () => {
        await setupLoggedIn();
        userEvent.click(logoutLink);
        const loginLink = await screen.findByRole("link", {name: "Login"});
        expect(loginLink).toBeInTheDocument();
    });
    it('sends logout request to backend after clicking logout', async () => {
        await setupLoggedIn();
        userEvent.click(logoutLink);
        await screen.findByRole("link", {name: "Login"});
        expect(logoutCount).toBe(1);
    });
    it('removes authorization header from request after user logs out', async () => {
        await setupLoggedIn();
        await userEvent.click(logoutLink);
        await screen.findByRole("link", {name: "Login"});
        const user = await screen.findByText('user-in-list');
        await userEvent.click(user);
        await screen.findByRole("heading", {name: "user-in-list"});
        expect(header).toBeFalsy();
    });
});

describe("Delete User", () => {
    let deleteButton;
    const setupLoggedInTheUserPage = async () => {
        storage.setItem('auth',
            {id: 5, username: "user5", isLoggedIn: true, header: "auth header value"});
        await setup("/user/5");
        deleteButton = await screen.findByRole("button", {
            name: "Delete My Account"
        });
    }
    it('redirect to homepage after deleting user', async () => {
        await setupLoggedInTheUserPage();
        await userEvent.click(deleteButton);
        await userEvent.click(screen.queryByRole("button", {name: "Yes"}));
        await screen.findByTestId("home-page");
    });
    it('displays login and sing up on navbar after deleting user', async () => {
        await setupLoggedInTheUserPage();
        await userEvent.click(deleteButton);
        await userEvent.click(screen.queryByRole("button", {name: "Yes"}));
        await screen.findByRole("link", {name: "Login"});

    });
});

console.error = () => {};