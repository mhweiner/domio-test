# Domio Take Home Challenge

This is my solution for the take home coding challenge for Domio. The assignment was to create a service that would:
  - Track price changes of inventory over time
  - Take certain actions given a set of rules/triggers when these price changes occur

## Approach

### Overview

My approach was to build a simple node script that could be run via command line. This could be run in a countless number of ways, for example, run as a service using `pm2`, `forever`, `systemd`, etc. The script accepts arguments to be run once or repeating at a specified interval.

### Persistance

The script maintains its own data layer persistance via SQLite. The database is a single file created by SQLite (property_price_events.sqlite3). There is a `--clean` flag that you can utilze with this script that will empty the database to start fresh (see usage below). Obviously, since this file only persists with this individual process, its usefulness is limited to its own runtime (among other limitations). In other words, the database won't know what happened before this script is run, and when the process ends, the database might get out of date quickly. Obviously scaling would also be an issue (see Areas for Improvement below).

### Rules

I implemented the two rules described in Part 2, but also considered a little about the problem described in Part 3 and began to implement a possible simple solution. In `lib/rules.js`, I have all possible rules, along with their trigger conditions and actions, both of which are implemented as lambda functions. Here, more rules can be added, along with possible actions to take as defined in `lib/ruleActions.js`. To take this one step further, I could imagine implementing a "subscription service" via API where other services can subscribe to certain price events and provide their own conditions.

### Email

So, I couldn't quite figure out how to properly demonstrate an email being sent in this take home exam format. It's not like I know where to send this fictional email, and how anyone evaluating this assignment will see it. Also, for all of the free email API services that I'm aware of (Sendgrid, Mailgun, etc), you need an account and a domain name or something. That all seemed like a futile effort, so I just faked it and used a logger to show the email being sent. Sorry :-/

## Areas for improvement

Obviously being limited to only 3 hours or so means I couldn't do everything I would do if this were going to actual production. Here are just a few of the areas for improvement:

### Testing

I did not have time to write any tests. Welp! I'm a big fan of BDD (Behavior Driven Development) where I unit test module's public methods and try to avoid writing brittle implementation-specific tests. I usually recommend 100% branch coverage with unit tests. I'd like use Istanbul to determine branch coverage, Mocha for tests, and JSLint for linting.

I'd also utilize integration tests and contract tests (check external dependencies for change in API, etc).

### Performance

There is plenty of room for improvement in terms of performance. For example, I could probably write a much more efficient SQL query that only runs once instead of for every property, every time. Since my database attempts to track ALL price changes over time (assuming this could be useful as an API for metrics, etc), combining all the queries into one became non-trivial and I just didn't have the time to come up with the proper compound query.

In fact, it would make much more sense for the persistence to be a proper cloud-based RDBMS service such as Amazon RDS. This way the database could be shared by multiple processes as we scale up, and the database wouldn't be so tightly coupled to this service. Spin up for these processes would also be much faster, and they wouldn't have to each first re-create the same database.

I believe the entire premise of polling the `propertites` service to be highly inefficient. A better approach would be a "pub-sub" model where this service subscribes to changes in price, and then we can handle each of these events as they come, passing off the grunt-work of checking against the rules to a worker pool which can be scaled dynamically depending on workload and performance metrics.

### Rules

Like I said before, I'd like to see a pub-sub API where other services can subscribe to events and provide their own conditional triggers. This way, we don't need to worry about emails, sms, or any other detail specific to that rule. Those services are responsible for what to do when the event is triggered, and can handle them in real-time. This is a much better way to scale things out.

## To build and run locally

You'll need to have node, npm, and yarn installed. Then do:

```
yarn
npm run poll
```

If you want to clean the database, you can run `npm run clean`.
