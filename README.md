[Vistara] 🎯
Basic Details
Team Name: [Byte-Sized-Babes]
Team Members
Member 1: [Sreya Maxwel] - [TKMCE]
Member 2: [Sivanandhana] - [TKMCE]
Member 3: [Sredha Gopan] - [TKMCE]
Hosted Project Link
https://sreyamaxwel.github.io/Vistara/welcome.html

Project Description
[Vistara is a platform dedicated to uplifting and empowering women 
in underprivileged communities. It provides access to diverse job
 opportunities, skill enhancement programs, and valuable resources 
 to support personal and professional growth. Vistara keeps women 
 informed about upcoming health camps, raises awareness about their
  rights, offers sex education, and provides crucial support services 
  like counseling and mentorship.Through this initiative, women can 
  connect with like-minded individuals, build and grow their businesses,
   and support one another in achieving success. At its core, Vistara 
   fosters community building and collaboration, creating a space for 
   women to thrive together.

]

The Problem statement
[Women in underprivileged communities face limited access to education,
 jobs, healthcare, and awareness of their rights, hindering their personal 
 and professional growth. This lack of support perpetuates poverty and restricts 
 community upliftment
]

The Solution
[Solution is our Vistara!Vistara provides a holistic platform 
for underprivileged women to access job opportunities, 
enhance skills, and grow their businesses. It raises
 awareness about health, rights, and education while
  offering counseling and community support. By 
  connecting like-minded individuals and fostering 
  collaboration, Vistara empowers women to achieve 
  independence and uplift their communities.
]

## Technical details

- **Frontend:** HTML, CSS, and vanilla JavaScript
- **Backend:** Python 3 standard library HTTP server
- **Data:** SQLite
- **Dependencies:** none; Bootstrap is not used by the current prototype

The GitHub Pages link above is the original static showcase. The interactive
registration, session, and job-board features require running `server.py`
locally (or deploying the backend separately).

Project Documentation
For Software:https://docs.google.com/document/d/1gnhGp6MHU1u4WLa5nbPQFUw6CeJBADFb/edit?usp=drive_link&ouid=103595395485750635934&rtpof=true&sd=true

Screenshots 
<img width="959" alt="scr1" src="https://github.com/user-attachments/assets/3ca23669-8161-4ff2-a059-e26f078a1d9f" />
This is the main homepage of the website where login and register i available
<img width="959" alt="scr2" src="https://github.com/user-attachments/assets/b9182d07-6457-4f12-8452-6219ddb61af9" />
This page shows the opportunities available for a user ,like various skill development and business ideas
<img width="956" alt="scr3" src="https://github.com/user-attachments/assets/fbd15c3a-1781-4dfb-95e1-18cb55a000c0" />
This page gives us details about the skill development facilities available


Diagrams

![flowchart](https://github.com/user-attachments/assets/de9c6efc-8a74-49d1-9d2d-ca1becd69d99)



Build Photos

![Final]
<img width="959" alt="scr1" src="https://github.com/user-attachments/assets/2f492918-37a1-4b77-96cc-bf70384a9529" />
<img width="932" alt="2b" src="https://github.com/user-attachments/assets/71b0fe4c-f2f2-420d-bc1a-b5aa12e50b08" />
<img width="959" alt="scr2" src="https://github.com/user-attachments/assets/548bef42-4d29-481d-8dfd-b4fc85679231" />



Project Demo
Video
https://drive.google.com/file/d/1-oRycQTUrrVztV4LmIhjc4VT7FJaKNzu/view?usp=drive_link




Team Contributions
[Sreya Maxwel]: [ Responsible for the main structure of the HTML, including the header and body.
Tasks:
Create the basic HTML document structure.
Set up the <head> section, including the <meta> tags, title, and linking to the Google Fonts.

Completed HTML layout and structure.]
[Sivanandhana]: [ Responsible for styling the page and ensuring a visually appealing design.
Tasks:
Apply general styling to the <body>, including setting the background image, font family, and background settings.
]
[Sredha Gopan]: [Responsible for handling the image used as the background.
Tasks:
Ensure the image (vist ht.png) is present and correctly linked in the project directory.
Optimize the image for better page load time and responsiveness (e.g., resizing or compressing the image).]

## Run the working prototype locally

The original pages are static HTML. A small Python standard-library server now
adds real registration, login, job posting, and job-interest flows backed by
SQLite. No package installation is needed; Python 3.10 or later is recommended.

1. Open a terminal in this project folder.
2. Start the server:

   ```powershell
   python server.py
   ```

3. Visit <http://127.0.0.1:8000/>. Register with a username of 3-40 characters
   and a password of at least 8 characters. Then open **Job Opportunities**.
4. Open another terminal and run the automated API checks:

   ```powershell
   python -m unittest -v
   ```

Stop the server with Ctrl+C. The first server start creates example jobs in
`vistara.db`; accounts, job posts, job-interest records, and hashed session
tokens remain in that database after restart. The server binds to
`127.0.0.1:8000` by default. `VISTARA_HOST` and `VISTARA_PORT` can be set for a
different local development address.

The job board refreshes from the API every 30 seconds and has live search,
location/sort controls, saved jobs, account status, and job-posting and
interest buttons. Health-camp and community pages clearly label their content
as sample data. The sponsor form is a local-only preview and does not transmit
or save submitted details.

## Learn how the pieces connect

### Frontend: HTML and JavaScript

- `login.html` and `register.html` provide the forms and browser-side input
  constraints.
- `app.js` listens for form submissions, sends JSON with `fetch`, and renders
  returned job data. The browser does not decide whether a password is valid;
  it displays the backend's success or error response.
- `job.html` is the job board. It provides the element IDs and form field names
  that `app.js` uses to render jobs, post a job, and record interest.

### Backend: Python HTTP API

- `server.py` serves the HTML, JavaScript, and images, and also handles API
  routes beginning with `/api/`.
- The browser sends requests such as `POST /api/login`. The handler validates
  input, executes database operations, and sends JSON with an HTTP status code.
- A successful login sets an HttpOnly session cookie. The browser sends it on
  later requests, so the server can identify which member posted or applied.
  Only a hash of the random session token is stored in SQLite; sessions expire
  after 12 hours and survive a server restart.
- The static file handler only serves website assets (HTML, CSS, JS, and
  images). It does not expose the database or Python source through the site.
- `GET /api/health` is a simple local health check.

### Database: SQLite

- `vistara.db` stores members in the existing `users` table. Passwords are
  stored as salted PBKDF2 hashes, never as the submitted plain-text password.
- The backend creates `jobs` and `applications` tables on startup. A job post
  belongs to its member, and a member can express interest in a job only once.
- A `sessions` table stores expiring hashes of random browser session tokens.
- SQL values are passed as parameters rather than concatenated into SQL text.

### Follow one request end-to-end

For example, posting a job goes through these steps:

1. `job.html` supplies named fields in the Post a Job form.
2. `app.js` reads those fields and sends JSON to `POST /api/jobs`.
3. `server.py` checks the session and validates each field.
4. A parameterized SQLite `INSERT` saves the job in `vistara.db`.
5. Python returns JSON; `app.js` fetches the updated job list and displays it.

Try changing the form labels, then trace the matching input names in `job.html`,
the request body in `app.js`, and the validation/INSERT in `server.py`. For a
next learning exercise, add a job search filter and pass its query through all
three layers.

This is a local learning prototype, not a production deployment. It binds to
localhost by default. Before any public deployment, add HTTPS, CSRF defenses,
login rate limits, account recovery and verification, robust backup/restore,
and a production-grade web server and database. Do not treat sample health,
community, or sponsorship content as real services.
