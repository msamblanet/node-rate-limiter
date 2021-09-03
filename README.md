# Node Rate Limiter
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

This repository is part of a collection of my personal node.js libraries and templates.  I am making them available to the public - feel free to offer suggestions, report issues, or make PRs via GitHub.

This project is a simple factory for the [rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible).  It provides factory methods and configuration types to make it compatible with the patters established in [@msamblanet/config-processor](https://github.com/msamblanet/node-config-processor).

The type of the queue to be created is specified by a string enum (generally expected to come from a config).  The values are enumerated in the type ```RateLimiterType```.  The values are:

- ```memory```
- ```memcache```
- ```mongo```
- ```redis```
- ```mysql```
- ```postgres```
- **Note:** cluster caches are not implemented at this time

## Usage

```typescript
import { RateLimiterType, RateLimiterFactory } from "@msamblanet/node-rate-limiter";

const rlConfig = {
    type: RateLimiterType.memory,
    opts: {} // See rate-limiter-flexible's IRateLimiterOptions
}
const rateLimiter = RateLimiterFactory.createLimiter(rlConfig);

const bConfig = {
    type: RateLimiterType.memory,
    opts: {} // See rate-limiter-flexible's IRateLimiterOptions,
    burst: {
        type: RateLimiterType.memory,
        opts: {} // See rate-limiter-flexible's IRateLimiterOptions,
    }
}
const burstLimiter = RateLimiterFactory.createBurst(bConfig);

const qConfig = {
    type: RateLimiterType.memory,
    opts: {} // See rate-limiter-flexible's IRateLimiterOptions,
    burst: {
        type: RateLimiterType.memory,
        opts: {} // See rate-limiter-flexible's IRateLimiterOptions,
    },
    queue: {} // See rate-limiter-flexible's IRateLimiterQueueOpts
}
const limiterQueue = RateLimiterFactory.createQueue(qConfig);

// See rate-limiter-flexible for details on using the resulting objects
```

## API

### RateLimiterFactory

Utility class with the APIs described below.  All methods are static - the class is just used for organization.

### RateLimiterFactory.createLimiter(config)

Creates a basic rate limiter with the given configuraiton.

### RateLimiterFactory.createBurst(config)

Creates a burst rate limiter with the given configuraiton.

### RateLimiterFactory.createQueue(config)

Creates a rate limiter queue with the given configuraiton.  May use either burst or

### Reexported types

The Typescript types for ```RateLimiterQueue```, ```RateLimiterAbstract```, and ```BurstyRateLimiter``` are all re-exported from ```rate-limiter-flexible``` so that you do not need a direct dependency on that module in your project.

