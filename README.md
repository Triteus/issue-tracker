# IssueTracker
Application to manage tickets.

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


## TODO
- implement project domain: Every ticket is assigned to a specific project
- add dashboard showing general info about all projects, users, tickets (tables, graphs)
- add details page for project: project name, assigned users, tickets, ...
- add user profile and settings
- add section showing who edited ticket and what they changed
- add notifications when ticket was updated
- add comment-section for ticket 
- integrate html-editor for description
