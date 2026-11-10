import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ResendTimer from "./ResendTimer";

describe("ResendTimer", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("enables resend when the countdown ends and restarts after resend", async () => {
    vi.useFakeTimers();
    const onResend = vi.fn();
    render(<ResendTimer seconds={1} onResend={onResend} />);

    expect(screen.getByText("00:01")).toBeTruthy();

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    fireEvent.click(screen.getByRole("button", { name: "Resend code" }));

    expect(onResend).toHaveBeenCalledOnce();
    expect(screen.getByText("00:01")).toBeTruthy();
  });
});
