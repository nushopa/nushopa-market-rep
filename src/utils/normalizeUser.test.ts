import { describe, expect, it } from "vitest";
import { normalizeUser } from "./normalizeUser";

describe("normalizeUser", () => {
  it("uses the API id and keeps profile status", () => {
    const user = normalizeUser({
      _id: "mongo-id",
      id: "public-id",
      first_name: "Ada",
      last_name: "Lovelace",
      email: "ada@example.com",
      role: 6000,
      status: "approved",
    });

    expect(user.id).toBe("public-id");
    expect(user._id).toBe("mongo-id");
    expect(user.status).toBe("approved");
  });

  it("rejects API users without an id", () => {
    expect(() =>
      normalizeUser({
        _id: "",
        first_name: "Ada",
        last_name: "Lovelace",
        email: "ada@example.com",
        role: 6000,
      }),
    ).toThrow("API user is missing both id and _id");
  });
});
