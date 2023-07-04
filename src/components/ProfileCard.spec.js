import ProfileCard from "./ProfileCard";
import {render, screen, waitForElementToBeRemoved} from "../test/setup";
import storage from "../state/storage";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";

let count, id, requestBody, header;
const server = setupServer(
    rest.put('/api/1.0/users/:id', (req, res, ctx) => {
        count += 1;
        id = req.params.id;
        requestBody = req.body;
        header = req.headers.get("Authorization");
        return res(ctx.status(200));
    })
);

beforeEach(() => {
    count = 0;
    id = 0;
    server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());


describe("Profile Card", () => {
    const setup = (user = {id: 5, username: "user5"}) => {
        storage.setItem("auth",
            {id: 5, username: "user5", header: "auth header value"}
        );
        render(<ProfileCard user={user}/>);
    }

    let saveButton;
    const setupInEditMode = async () => {
        setup();
        await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
        saveButton = screen.getByRole('button', { name: 'Save' });
    };

    it("edit button when logged in user is shown on card", async () => {
        setup();
        expect(screen.getByRole("button", {name: "Edit"})).toBeInTheDocument();
    });
    it("does not edit button for another user", async () => {
        setup({id: 2, username: "user2"});
        expect(screen.queryByRole("button", {name: "Edit"})).not.toBeInTheDocument();
    });
    it("displays input after clicking Edit", async () => {
        setup();
        expect(
            screen.queryByLabelText('Change your username')).not.toBeInTheDocument();
        await userEvent.click(screen.queryByRole("button", {name: "Edit"}));
        expect(
            screen.queryByLabelText('Change your username')).toBeInTheDocument();
    });
    it("displays save and cancel buttons in edit mode", async () => {
        setup();
        await userEvent.click(screen.queryByRole("button", {name: "Edit"}));
        expect(screen.queryByRole("button", {name: "Save"})).toBeInTheDocument();
        expect(screen.queryByRole("button", {name: "Cancel"})).toBeInTheDocument();
    });
    it("hides Edit button and username header in edit mode", async () => {
        setup();
        await userEvent.click(screen.queryByRole("button", {name: "Edit"}));
        expect(
            screen.queryByRole("button", {name: "Edit"})).not.toBeInTheDocument();
        expect(
            screen.queryByRole("heading", {name: "user5"})).not.toBeInTheDocument();
    });
    it("has the current username in input", async () => {
        setup();
        await userEvent.click(screen.queryByRole("button", {name: "Edit"}));
        const input = screen.queryByLabelText('Change your username');
        // expect(input.value).toBe('user5');
        expect(input).toHaveValue('user5');
    });
    it("displays spinner during api call", async () => {
        await setupInEditMode();
        await userEvent.click(saveButton);
        const spinner = screen.getByRole("status");
        await waitForElementToBeRemoved(spinner);
    });
    it("disables the button during api call", async () => {
        await setupInEditMode();
        await userEvent.click(saveButton);
        await userEvent.click(saveButton);
        const spinner = screen.getByRole("status");
        await waitForElementToBeRemoved(spinner);
        expect(count).toBe(1);
    });
    it("sends request to the endpoint having logged in user id", async () => {
        await setupInEditMode();
        await userEvent.click(saveButton);
        const spinner = screen.getByRole("status");
        await waitForElementToBeRemoved(spinner);
        expect(id).toBe("5");
    });
    it("sends request with body having updated username", async () => {
        await setupInEditMode();
        const editInput = screen.getByLabelText("Change your username");
        await userEvent.clear(editInput);
        await userEvent.type(editInput, "user5-updated");
        await userEvent.click(saveButton);
        const spinner = screen.getByRole("status");
        await waitForElementToBeRemoved(spinner);
        expect(requestBody).toEqual({username: "user5-updated"});
    });
    it ("sends request with authorization header", async () => {
        await setupInEditMode();
        await userEvent.click(saveButton);
        const spinner = screen.getByRole("status");
        await waitForElementToBeRemoved(spinner);
        expect(header).toBe("auth header value");
    });
    it("sends request with body having username even user does not update it", async () => {
        await setupInEditMode();
        await userEvent.click(saveButton);
        const spinner = screen.getByRole("status");
        await waitForElementToBeRemoved(spinner);
        expect(requestBody).toEqual({username: "user5"});
    });
    it("hides edit layout after success update", async () => {
        await setupInEditMode();
        await userEvent.click(saveButton);
        const editButton = await screen.findByRole("button", {name: "Edit"});
        expect(editButton).toBeInTheDocument();
    });
    it("updates username in profile card after successful update", async () => {
        await setupInEditMode();
        const editInput = screen.getByLabelText("Change your username");
        await userEvent.clear(editInput);
        await userEvent.type(editInput, "new-username");
        await userEvent.click(saveButton);
        const newUsername = await screen.findByRole("heading",
            {name: "new-username"}
        );
        expect(newUsername).toBeInTheDocument();
    });
    it("displays last updated name input in edit mode after successful username update", async () => {
        await setupInEditMode();
        let editInput = screen.getByLabelText("Change your username");
        await userEvent.clear(editInput);
        await userEvent.type(editInput, "new-username");
        await userEvent.click(saveButton);
        const editButton = await screen.findByRole("button", {name: "Edit"});
        await userEvent.click(editButton);
        editInput = screen.getByLabelText("Change your username");
        expect(editInput).toHaveValue("new-username");
    });
});

console.error = () => {};