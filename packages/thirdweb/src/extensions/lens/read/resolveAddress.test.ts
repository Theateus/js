import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { isAddress } from "../../../utils/address.js";
import { resolveAddress } from "./resolveAddress.js";

describe("resolve lens address", () => {
  it("should resolve to correct address", async () => {
    const address = await resolveAddress({
      client: TEST_CLIENT,
      name: "captain_jack",
    });
    // "captain_jack" is a valid localname so it should definitely resolve to a valid address
    expect(isAddress(address)).toBe(true);
  });
});
