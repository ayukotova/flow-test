# Installation and run

You need to have some recent node.js version and Chrome browser on your box.

```
$ npm install
$ npm test
```

# Test documentation

The task was to test the country list.
Acceptance tests for this feature should include the data check and the ability to filter data.
Data check is tested in 'fetches all items' test (response is not empty, all keys are present, the number of entries is as expected, and all the data are as expected). This test is perfect for regression since any changes in the country list be it a missing key or incorrect data would make this test fail.

Regarding the filter, there are 6 options for StringQueryOperatorInput (see https://countries.trevorblades.com/ docs): eq, ne, in, nin, regex, glob; and there are 3 possible inputs for filtration: code, currency, and continent. Thus, it seems reasonable to use decision table testing technique here to provide comprehensive coverage of all possible combinations:

* 'fetches all items filtered by _regex_ code' - checks filter by code with _regex_ operator
* 'fetches all items filtered by _glob_ code' - checks filter by code with _glob_ operator
* 'fetches all items filtered by _eq_ continent' - checks filter by continent with _eq_ operator
* 'fetches all items filtered by _ne_ continent' - checks filter by continent with _ne_ operator
* 'fetches all items filtered by _nin_ currency' - checks filter by currency with _nin_ operator
* 'fetches all items filtered by _in_ currency' - checks filter by currency with _in_ operator

Next, it is important to test negative scenarios.
* 'fetches all items filtered by non existing code' - checks that filter by non existing code returns an empty list
* 'fetches all items filtered by very long non existing code' - checks that filter by very long non existing code will respond with some error

Overall, two of nine tests failed.
* 'fetches all items filtered by _glob_ code' - responds with INTERNAL_SERVER_ERROR although it should pass
* 'fetches all items filtered by very long non existing code' - does not respond with an error, the test fails by Cypress timeout which means that in real life the user will also encounter a vary long wait. This request should return an error.

This test suite seems complete for acceptance and regression since it checks the main two features (the country list and the ability to filter countries). If data are corrupted or if changes to filter operators are made incorrectly, these tests will fail and notify us about the issues in the service.
Still, some tests might be added, for instance, security checks (e.g., filter by XSS) or performance/stress checks to test the performance of the system (since this endpoint has a large volume of users).