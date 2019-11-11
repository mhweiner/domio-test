# Domio Take Home Challenge

This is my solution for the take home coding challenge for Domio. The assignment was to create a service that would:
  - Track price changes of inventory over time
  - Take certain actions given a set of rules/triggers when these price changes occur

## Approach

### Overview

My approach was to build a simple node script that could be run via command line. This could be run in a countless number of ways, for example, run as a service using `pm2`, `forever`, `systemd`, etc. The script accepts arguments to be run once or repeating at a specified interval.

### Persistance

The script maintains its own data layer persistance via SQLite. The database is a single file created by SQLite (property_price_events.sqlite3). There is a `--clean` flag that you can utilze with this script that will empty the database to start fresh (see usage below).

### Rules

I implemented the two rules described in Part 2, but also considered a little about the problem described in Part 3 and began to implement a possible simple solution. In `lib/rules.js`, I have all possible rules, along with their trigger conditions and actions, both of which are implemented as lambda functions. Here, more rules can be added, along with possible actions to take as defined in `lib/ruleActions.js`. To take this one step further, I could imagine implementing a "subscription service" via API where other services can subscribe to certain price events and provide their own conditions.

### Email

So, I couldn't quite figure out how to properly demonstrate an email being sent in this take home exam format. It's not like I know where to send this fictional email, and how anyone evaluating this assignment will see it. Also, for all of the free email API services that I'm aware of (Sendgrid, Mailgun, etc), you need an account and a domain name or something. That all seemed like a futile effort, so I just faked it and used a logger to show the email being sent. Sorry :-/

### Failures and Logging

I am using `roarr`, a simple JSON logging utility. Since this service will output JSON to `STDOUT`, it can be caught and sent to a store somewhere for catching server errors or later recall for debugging, analysis, etc. I'm using ES6 Promises and liberal usage of catch() blocks to try to catch errors before they snowball and to give useful error logs with stack traces.

## Areas for improvement

Obviously being limited to only 3 hours or so means I couldn't do everything I would do if this were going to actual production. Here are just a few of the areas for improvement:

### Testing

I did not have time to write any tests. Welp! I'm a big fan of BDD (Behavior Driven Development) where module's public methods are tested, with the goal of avoiding brittle implementation-specific tests. Regardless of flavor of TDD, I usually recommend 100% line AND branch coverage with unit tests. In the past I've used Istanbul to determine branch coverage, Mocha for tests, and JSLint for linting.

I'd also utilize integration tests and contract tests (check external dependencies for change in API, etc).

### Performance & Data Persistence

There is plenty of room for improvement in terms of performance. For example, I could probably write a much more efficient SQL query that only runs once instead of for every property, every time. Since my database attempts to track ALL price changes over time (assuming this could be useful as an API for metrics, etc), combining all the queries into one became non-trivial and I just didn't have the time to come up with the proper compound query.

In fact, it would make much more sense for the persistence to be a proper cloud-based RDBMS service such as Amazon RDS. This way the database could be shared by multiple containers/machines as we scale up, and the database wouldn't be so tightly coupled to this service. We also wouldn't have as many issues with the database becoming a bottleneck.

Of course, to begin with, the entire premise of polling the `propertites` service is highly inefficient. A better approach would be a "pub-sub" model where this service itself subscribes to changes in price, and then we can handle each of these events as they come, passing off the grunt-work of checking against the rules to a worker pool which can be scaled dynamically depending on workload and performance metrics.

### Failures

If each "rule" was being handled by a subscriber service, then that service would be responsible for sending emails, SMS, etc. Each service would be responsible for tracking its own tasks and re-attempting failed tasks a few times before giving up, and then raising any concerns to the authorities (on call tech staff, etc).  The question of what exactly to do in case of failure would depend on the business requirements, the failure, and probably other factors. The lowest hanging fruit here is the seperation of concerns and good logging. Beyond that, it's about looking at possible failure scenarios individually and understanding the business requirements around how to approach them.

## To build and run locally

You'll need to have node, npm, and yarn installed. Then do:

```
yarn
npm run poll
```

If you want to clean the database, you can run `npm run clean`.
