
# IDEKO UC Application

IDEKO demonstrator apps than consume the Node-RED CAF.

## Application
There are two applications, app2 and app3, from the _IDEKO Use case_ document (private to the consortium)

- **app2.html**: Demo application for our demo client, SPART Manufacturing.
- **app3.html**: Demo application made for DANOBATGROUP's technical service team.

### Login
Two logins must be done in order to use the apps. The apps guide the user through the login process:

- **Application login**: This is the login provided by the application developer, nothing to do with DITAS.
- **DITAS framework login**: To identify the user against the DITAS Framework, which calls the Keycloak server.

### Methods
Both application call or can call the following methods.

- `/GetStreamingData`: Streaming data from the machines.
- `/GetSimplifiedDiagnostic`: A simple diagnostic for the machines being monitored.
- `/GetFullDiagnostic`: A complete diagnostic for the machines being monitored.

### Functioning
When _app2_ launches:

- Calls only once to `/GetStreamingData` (as it is a stream, the connection is never closed)
- Every 2 seconds (_GetStreamValuesInterval_) the values are read and printed.
- Every 30 seconds (_CallAndPrintDiagnosticValuesInterval_) calls to `/GetSimplifiedDiagnostic` and values are printed.

When _app3_ launches:

- Calls only once to `/GetStreamingData` (as it is a stream, the connection is never closed)
- Every 2 seconds (_GetStreamValuesInterval_) the values are read and printed.
- Every 30 seconds (_CallAndPrintDiagnosticValuesInterval_) calls to `/GetFullDiagnostic` and values are printed.

### Access control
After logging on the _DITAS framework_, a JWT token is received and added to every method call. This means that when the application calls to the  `/GetSimplifiedDiagnostic` method for example, the request header `Authorization: Beaber JWT` will be added, being `JWT` the token received after the _DITAS framework_ login.

### Others
Charts by *Highcharts*.
