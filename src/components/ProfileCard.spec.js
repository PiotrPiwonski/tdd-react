import ProfileCard from "./ProfileCard";
import {render, screen} from "../test/setup";
import storage from "../state/storage";
import userEvent from "@testing-library/user-event";

describe("Profile Card", () => {
    const setup = (user = {id: 5, username: "user5"}) => {
        storage.setItem("auth", {id: 5, username: "user5"});
        render(<ProfileCard user={user}/>);
    }
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
})