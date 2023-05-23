import SingUpPage from './SingUpPage';
import {render, screen} from '@testing-library/react';

it("has header", () => {
    render(<SingUpPage/>);
    const header = screen.queryByRole("heading", {name: "Sing Up"});
    expect(header).toBeInTheDocument();
})