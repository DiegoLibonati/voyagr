import "@testing-library/jest-dom";

import { TextDecoder, TextEncoder } from "util";

const mockFetch = jest.fn();

Object.assign(globalThis, { TextEncoder, TextDecoder });

globalThis.fetch = mockFetch;
