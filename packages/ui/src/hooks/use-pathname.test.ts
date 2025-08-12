import { renderHook, act } from "@testing-library/react-hooks";
import { usePathname } from "./use-pathname.ts";

describe("usePathname", () => {
  it("should return current pathname", () => {
    const { result } = renderHook(() => usePathname());
    expect(result.current.pathname).toBe(window.location.pathname);
  });

  it("should update pathname", () => {
    const { result } = renderHook(() => usePathname());

    act(() => {
      result.current.updatePathname("/new-path");
    });

    expect(result.current.pathname).toBe("/new-path");
  });
});
