//
// This file provided a utility class (just static methods) for dynamically creating
// a RateLimiter from the rate-limiter-flexible project
// The rate-limiter interfaces are re-exported for convience
//
import * as RateLimiter from "rate-limiter-flexible";
import { Config } from "@msamblanet/node-config-types";

// Convience exports
export type { RateLimiterQueue, RateLimiterAbstract, BurstyRateLimiter } from "rate-limiter-flexible";

// The different types of rate limiters
export enum RateLimiterType {
    memory = "memory",
    memcache = "memcache",
    mongo = "mongo",
    redis = "redis",
    mysql = "mysql",
    postgres = "postgres"
    // @todo Implement cluster
}

// Union of all the different option types
export type RateLimiterOptions =
    RateLimiter.IRateLimiterOptions |
    RateLimiter.IRateLimiterClusterOptions |
    RateLimiter.IRateLimiterStoreOptions |
    RateLimiter.IRateLimiterMongoOptions;

// A config interface for a basic limiter
export interface RateLimiterConfig extends Config {
    type: RateLimiterType,
    opts: RateLimiterOptions,
}

// A config interface for a burst limiter
export interface BurstRateLimiterConfig extends RateLimiterConfig {
    burst: RateLimiterConfig
}

// A config interface for a queue limiter
export interface QueueRateLimiterConfig extends RateLimiterConfig {
    burst?: RateLimiterConfig
    queue: RateLimiter.IRateLimiterQueueOpts,
}

export class RateLimiterFactory {
    //
    // Creates a basic limiter from the config
    //
    public static createLimiter(config: RateLimiterConfig): RateLimiter.RateLimiterAbstract {
        switch (config.type) {
            case RateLimiterType.memory: return new RateLimiter.RateLimiterMemory(config.opts);

            /* istanbul ignore next : not unit testing anything other than memory limiters at this time*/
            case RateLimiterType.memcache:return new RateLimiter.RateLimiterMemcache(config.opts as RateLimiter.IRateLimiterStoreOptions);

            /* istanbul ignore next : not unit testing anything other than memory limiters at this time*/
            case RateLimiterType.mongo:return new RateLimiter.RateLimiterMongo(config.opts as RateLimiter.IRateLimiterMongoOptions);

            /* istanbul ignore next : not unit testing anything other than memory limiters at this time*/
            case RateLimiterType.redis:return new RateLimiter.RateLimiterRedis(config.opts as RateLimiter.IRateLimiterStoreOptions);

            /* istanbul ignore next : not unit testing anything other than memory limiters at this time*/
            case RateLimiterType.mysql:return new RateLimiter.RateLimiterMySQL(config.opts as RateLimiter.IRateLimiterStoreOptions);

            /* istanbul ignore next : not unit testing anything other than memory limiters at this time*/
            case RateLimiterType.postgres:return new RateLimiter.RateLimiterPostgres(config.opts as RateLimiter.IRateLimiterStoreOptions);

            default: throw new Error(`Unknown rate limiter type: ${config.type}`);
        }
    }

    //
    // Creates a burst limiter from the config
    //
    public static createBurst(config: BurstRateLimiterConfig): RateLimiter.BurstyRateLimiter {
        return new RateLimiter.BurstyRateLimiter(RateLimiterFactory.createLimiter(config), RateLimiterFactory.createLimiter(config.burst));
    }

    //
    // Creates a queue limiter from the config
    //
    public static createQueue(config: QueueRateLimiterConfig): RateLimiter.RateLimiterQueue {
        const baseLimiter = config.burst ? RateLimiterFactory.createBurst(config as BurstRateLimiterConfig) : RateLimiterFactory.createLimiter(config);
        return new RateLimiter.RateLimiterQueue(baseLimiter, config.queue);
    }
}

export default RateLimiterFactory;
