import LoginForm from "@/components/auth/login-form";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react");
  return {
    __esModule: true,
    ...originalModule,
    signIn: jest.fn(),
    useSession: jest.fn(() => ({
      data: null,
      status: "unauthenticated",
    })),
  };
});

describe("Login Page Testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("test email input and error handling", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({
      ok: false,
      error: "Invalid email or password",
    });

    render(
      <SessionProvider
        session={{
          expires: "1",
          //   user: null,
        }}
      >
        <LoginForm />
      </SessionProvider>
    );

    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    expect(emailInput).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });

    const passwordInput = screen.getByTestId("password");
    expect(passwordInput).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    const submitButton = screen.getByRole("button", {
      name: /sign in with email/i,
    });
    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(/invalid email or password/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("test successful login", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    const { push } = useRouter();

    render(
      <SessionProvider
        session={{
          expires: "1",
          //   user: null,
        }}
      >
        <LoginForm />
      </SessionProvider>
    );

    const emailInput = screen.getByTestId("email-address");
    expect(emailInput).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(emailInput, {
        target: { value: "kahanimostafa83@gmail.com" },
      });

      const passwordInput = screen.getByTestId("password");
      fireEvent.change(passwordInput, { target: { value: "Aa12345@#" } });

      const submitButton = screen.getByRole("button", {
        name: /sign in with email/i,
      });
      fireEvent.click(submitButton);
    });
    // Check if the router push was called to redirect to the dashboard with the correct URL
    // expect(push).toHaveBeenCalledWith("/dashboard");
  });
});
