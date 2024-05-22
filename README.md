# GreatReadsDatabase
GRDB


Responsive CRUD application with token management and built in React and .NET C# API.
The application must be ready to be uploaded to web hosting, but for testing and teaching I will use Docker containers for back end, front end, database and file storage.

Requirements Front End:
- Implement a web application that displays a list of books and where users can read what others thought about them.
- The user can search for books and read reviews about them
- The user can create an account and log in
- A logged-in user can add new books to the database, leave reviews for other books or create a list of books that you like
- A logged in user can edit or delete only those books that he added to the database.

Requirements Back End:
- Implement a CRUD application that creates and takes care of a database containing books and reviews of these books, authors, users
- Create an administration page where an admin can log in and administer the database: add/edit/delete books (possibly users)
Token Management:
• Implement user authentication using JWT (JSON Web Tokens).
• Create a simple login page where users can enter their credentials (eg username and password).
• After successful login, the back-end should generate a token and send it back to the front-end.
• The front-end should store the token securely (eg in local storage or a cookie) and use it for subsequent API requests to the back-end.
• Implement token validation on the back-end to ensure that only authenticated users can access the CRUD operations.
