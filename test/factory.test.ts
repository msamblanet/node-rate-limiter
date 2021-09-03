import * as dotenv from 'dotenv';
dotenv.config();

import * as Lib from "../src/index";
import LibDefault from "../src/index";

test("Verify Exports", () => {
    expect(Lib.RateLimiterType).not.toBeNull();
    expect(Lib.RateLimiterFactory).not.toBeNull();
    expect(LibDefault).not.toBeNull();
    expect(LibDefault).toEqual(Lib.RateLimiterFactory);

    expect(LibDefault).toHaveProperty("createLimiter");
    expect(LibDefault).toHaveProperty("createBurst");
    expect(LibDefault).toHaveProperty("createQueue");
});

test("Basic function - Limiter", () => {
    expect(LibDefault.createLimiter({
        type: Lib.RateLimiterType.memory,
        opts: {}
    })).not.toBeNull;
});
test("Basic function - Burst", () => {
    expect(LibDefault.createBurst({
        type: Lib.RateLimiterType.memory,
        opts: {},
        burst: {
            type: Lib.RateLimiterType.memory,
            opts: {},
        }
    })).not.toBeNull;
});
test("Basic function - Queue", () => {
    expect(LibDefault.createQueue({
        type: Lib.RateLimiterType.memory,
        opts: {},
        queue: {}
    })).not.toBeNull;
});
test("Basic function - Queue with Burst", () => {
    expect(LibDefault.createQueue({
        type: Lib.RateLimiterType.memory,
        opts: {},
        burst: {
            type: Lib.RateLimiterType.memory,
            opts: {},
        },
        queue: {}
    })).not.toBeNull;
});

test("Errors - bad type", () => {
    const config = {type: "foo"};
    expect(() => LibDefault.createLimiter(config as Lib.RateLimiterConfig)).toThrowError("Unknown rate limiter type: foo");
})
