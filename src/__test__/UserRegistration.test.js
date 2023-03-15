import React from "react";
import {
  render,
  screen,
  fireEvent,
  queryByAttribute,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import UserRegistrationForm from "src/components/UserRegistrationForm";

const getById = queryByAttribute.bind(null, "id");

const setup = () => {
  const utils = render(<UserRegistrationForm />);
  const name = getById(utils.container, "name");
  const email = getById(utils.container, "email");
  const contact = getById(utils.container, "contact");
  const submit = getById(utils.container, "submit");

  return {
    name,
    email,
    contact,
    submit,
    ...utils,
  };
};

let testName = "UserRegistration boundary";

describe("boundary", () => {
  test(testName + " name is required", async () => {
    const { name } = setup();
    act(() => {
      fireEvent.blur(name);
    });
    await waitFor(async () => {
      expect(await screen.findByText(/Name is required/i)).toBeTruthy();
    });
  });

  test(testName + " name is Valid", async () => {
    const { name } = setup();
    act(() => {
      fireEvent.blur(name);
      fireEvent.change(name, { target: { value: "temp name" } });
    });
    await waitFor(async () => {
      const nameError = screen.queryByText(/Name is required./i);
      expect(nameError).toBeNull();
    });
  });
});

describe("boundary", () => {
  test(testName + " Invalid Email", async () => {
    const { email } = setup();
    act(() => {
      fireEvent.blur(email);
    });
    await waitFor(async () => {
      expect(await screen.findByText(/Invalid Email/i)).toBeTruthy();
    });
  });

  test(testName + " Email is invalid", async () => {
    const { email } = setup();
    act(() => {
      fireEvent.blur(email);
      fireEvent.change(email, { target: { value: "abc" } });
    });
    await waitFor(async () => {
      expect(await screen.findByText(/Invalid Email/i)).toBeTruthy();
    });
  });

  test(testName + " Email is Valid", async () => {
    const { email } = setup();
    act(() => {
      fireEvent.blur(email);
      fireEvent.change(email, { target: { value: "abc@def.com" } });
    });
    await waitFor(async () => {
      const emailError = screen.queryByText(/Invalid Email/i);
      expect(emailError).toBeNull();
    });
  });
});

describe("boundary", () => {
  test(testName + " submit button disabled on invalid data", async () => {
    const utils = render(<UserRegistrationForm />);
    expect(getById(utils.container, "submit")).toBeInTheDocument();
    expect(getById(utils.container, "submit")).toBeDisabled();
  });

  test(testName + " submit button enabled on valued text", async () => {
    const utils = render(<UserRegistrationForm />);
    const { name, email, contact } = setup();
    await waitFor(() => {
      fireEvent.blur(name);
      fireEvent.change(name, { target: { value: "Tom Jerry" } });
      fireEvent.blur(email);
      fireEvent.change(email, { target: { value: "abc@mail.com" } });
      fireEvent.blur(contact);
      fireEvent.change(contact, { target: { value: "1234567890" } });
      expect(getById(utils.container, "submit")).toBeInTheDocument();
      expect(
        getById(utils.container, "submit").getAttribute("disabled")
      ).not.toBeTruthy();
    });
  });
});
