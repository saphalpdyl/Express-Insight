import { vi, expect, it, describe, beforeEach, beforeAll, afterAll } from "vitest";
import ExpressInsight from "../../../lib/index.js";
import e from "express";
import supertest from "supertest";

describe("Test the configuration DX", () => {
  // Test all warnings and errors
  const consoleMock = vi.spyOn(global.console, "log");

  let mockExpressApp; // mock app

  beforeEach(() => {
    mockExpressApp = e();
  })
  
  afterAll(() => {
    consoleMock.mockReset();
  });
  
  it("should throw a warning at missing configuration", () => {
    ExpressInsight.setupExpressInsight(mockExpressApp, {});

    expect(consoleMock.mock.lastCall[0]).toContain("[settings.missing]");
  });

  describe("Test the error plugin setup handlers", () => {
    it("should throw an warning when the .setupErrorPlugin is called but not enabled in configuration", () => {
      const instance = ExpressInsight.setupExpressInsight(mockExpressApp, {
        error: {
          enable: false,
        }
      });

      instance.setupErrorPlugin();

      expect(consoleMock.mock.lastCall[0]).contain("[expInsight.init]");
      expect(consoleMock.mock.lastCall[0]).contain("disabled");
    });

    it("should throw an error when error logging is enabled in the settings but plugin is not setup", async () => {
      const instance = ExpressInsight.setupExpressInsight(mockExpressApp, {
        error: {
          enable: true,
        }
      });
      const response = await supertest(mockExpressApp).get('/');
      expect(response.text).toContain("error.enable == true");
      
    });
    
    it("should type check error override", () => {
      expect(() => {
        const instance = ExpressInsight.setupExpressInsight(mockExpressApp, {
          error: {
            enable: true,
            overrideErrorPage: "",
          }
        });
        instance.setupErrorPlugin();
      }).toThrowErrorMatchingInlineSnapshot(`[Error: [expInsight.init] overrideErrorPage is neither a boolean nor a function]`);
    });
  });
});