# IssueTracker
Application to track and work on issues, features, ... within a project.

Deployed version: https://vast-peak-43691.herokuapp.com/

## Technologies
### Frontend
- Angular 8
- Angular Material
- Drag and Drop (Angular CDK)
- RxJs
- ...

### Backend
- Express
- Express-validator
- DB: MongoDB, Mongoose (ODM)
- TypeScript
- OvernightJS
- File-Upload: Multer
- Unit-tests, testing API-endpoints: Jest, Supertest
- Passport.js
- ...

## Versions
### Version 0.1
- **Authentication:** Users can create an account and sign in. Most routes are protected, so that only authenticated user can access them.
- **Authorization:** Users are assigned certain roles. E.g. only a support can edit existing tickets.
- **Material design:** using angular material
- **Dark Theme:** Users can toggle between light and dark theme. All pages are adjusted using consistent colors specified by the theme.
- **Ticket-Table:** Showing all available tickets in a table that supports pagination, filtering by several criteria and sorting.
- **Ticket-Board (support-only)**: Supports can quickly change a ticket's status by dragging a ticket to another column. 
- **Ticket-Details:** Show all available data for a given ticket.
- **Ticket-Form:** Users can create a new ticket or edit an existing one. Supports file upload and -download.

### Version 0.2
- **Project-Domain:** Tickets are assigned to one project, users are assigned by project-creator to work with tickets on this project
- **Ticket-Comments:** User can create comments on tickets, filter (asc, desc) by creation-date, pagination
- **Ticket-History:** User can see all ticket-changes (who, when, what)
- **Dynamic sidenav:** User gets available navigation-paths based on whether ticket or project was selected
- **User profile:** Users can change username, password, email
- **Guest-Account:** User can user guest account to be granted read access to all recources
- **Dashboard:** Page showing current stats, assigned projects and most recently created tickets


## TODO
### V 0.2 (DONE)
- <del>implement project domain: Every ticket is assigned to a specific project</del>
- <del>add dashboard showing general info about all projects, users, tickets (tables, graphs)</del>
- <del>add details page for project: project name, assigned users, tickets, ... </del>
- <del>dd user profile and settings</del>
- <del>add section showing who edited ticket and what they changed</del>
- <del>add comment-section for ticket </del>

### V 0.25 (TODO)
- <del>prepare application for deployment (config, rate-limiter, ...)</del>
- <del>deploy application</del>
- <del>add rate limiter</del>
- add script that creates and saves random data (users, projects, tickets, ...) upon execution

### V 0.3 (TODO)
- integrate html-editor for description of tickets and projects (and maybe comments)
- use 0Auth
- improve styling, layout and responsiveness
- refactoring
- add proper animations
- manage profile-img of user accounts
- improve performance: indexing, use in-memory db for tests, decrease size of responses, ...
- add notifications when ticket was updated
- ...

