import RegisterForm from "@/components/auth/register-form";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("test register inputs", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;
  });

  it("test inputs errors", async () => {
    render(
      <SessionProvider session={{ expires: "1" }}>
        <RegisterForm />
      </SessionProvider>
    );

    const submitButton = screen.getByRole("button", { name: /register/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const firstNameInput = screen.getByTestId("first-name");
    const lastNameInput = screen.getByTestId("last-name");
    const emailInput = screen.getByTestId("email");
    const passwordInput = screen.getByTestId("password");
    const confirmPasswordInput = screen.getByTestId("confirm-password");

    expect(firstNameInput).toBeInvalid();
    expect(lastNameInput).toBeInvalid();
    expect(emailInput).toBeInvalid();
    expect(passwordInput).toBeInvalid();
    expect(confirmPasswordInput).toBeInvalid();

    await act(async () => {
      fireEvent.change(firstNameInput, { target: { value: "John" } });
      fireEvent.click(submitButton);
    });

    expect(firstNameInput).toBeValid();
    expect(lastNameInput).toBeInvalid();
    expect(emailInput).toBeInvalid();
    expect(passwordInput).toBeInvalid();
    expect(confirmPasswordInput).toBeInvalid();

    await act(async () => {
      fireEvent.change(lastNameInput, { target: { value: "Doe" } });
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "different" },
      });
      fireEvent.click(submitButton);
    });

    expect(emailInput).toBeInvalid();

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "valid@email.com" } });
      fireEvent.click(submitButton);
    });

    const errorMessage = await screen.findByText(/passwords do not match/i);
    expect(errorMessage).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(confirmPasswordInput, { target: { value: "password" } });
      fireEvent.click(submitButton);
    });

    expect(firstNameInput).toBeValid();
    expect(lastNameInput).toBeValid();
    expect(emailInput).toBeValid();
    expect(passwordInput).toBeValid();
    expect(confirmPasswordInput).toBeValid();
  });

  it("test password mismatch", async () => {
    render(
      <SessionProvider session={{ expires: "1" }}>
        <RegisterForm />
      </SessionProvider>
    );

    fireEvent.change(screen.getByTestId("first-name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByTestId("last-name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByTestId("confirm-password"), {
      target: { value: "DifferentPassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    const errorMessage = await screen.findByText(/passwords do not match/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("test successful registration", async () => {
    render(
      <SessionProvider session={{ expires: "1" }}>
        <RegisterForm />
      </SessionProvider>
    );

    await act(async () => {
      fireEvent.change(screen.getByTestId("first-name"), {
        target: { value: "John" },
      });
      fireEvent.change(screen.getByTestId("last-name"), {
        target: { value: "Doe" },
      });
      fireEvent.change(screen.getByTestId("email"), {
        target: { value: "john.doe@example.com" },
      });
      fireEvent.change(screen.getByTestId("password"), {
        target: { value: "Password123" },
      });
      fireEvent.change(screen.getByTestId("confirm-password"), {
        target: { value: "Password123" },
      });

      fireEvent.click(screen.getByRole("button", { name: /register/i }));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          password: "Password123",
        }),
      })
    );

    expect(mockPush).toHaveBeenCalledWith("/auth/login?registered=true");
  });
});
