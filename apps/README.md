# IDEKO UC Application

[WIP, lot of things missing]

IDEKO demontrator apps than consume the Node-RED CAD.

THere are two applications, apps 2 and 3 from the _IDEKO Use case_ document (private to the consortium)

- **app2.html**: Demo application for our demo client, Spart Manufacturing.
- **app3.html**: Demo applicatin made for DANOBATGROUP's technical service team.

Two login must be done in order to use the apps. The apps guide the user through the login process:

- **Application login**: This is the login provided by the application developer, nothing to do with DITAS. 
- **DITAS framework login**": To identify the user agains the DITAS Framework.

Both application call or can call the following methods:

- `/GetStreamingData**: Streaming data from the machines.
- `/GetSimplifiedDiagnostic`: A simple diagnostic for the machines being monitored.
- `/GetFullDiagnostic`: A complete diagnostic for the machines being monitored.

When _app2_ is launches:

- Calls to `/GetStreamingData` 
- Every 2 seconds (_GetStreamValuesInterval_) the values are read and printed.
- Every 20 seconds (_CallDiagnosticValuesInterval_) calls to `/GetSimplifiedDiagnostic`.
- Every 30 seconds (_GetDiagnosticValuesInterval_) values fromt the previous call are printed.

Cuando se abre la _app3_:

- Calls to `/GetStreamingData` 
- Every 2 seconds (_GetStreamValuesInterval_) the values are read and printed.
- Every 20 seconds (_CallDiagnosticValuesInterval_) calls to `/GetFullDiagnostic`.
- Every 30 seconds (_GetDiagnosticValuesInterval_) values fromt the previous call are printed.

Charts by *Highcharts*.