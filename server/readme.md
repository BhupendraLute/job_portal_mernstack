# Job Portal Server

Backend for job_portal using Node.jd, Express.js and MongoDB database

## Table of Contents

-   [Installation](#installation)
-   [API Endpoints](#api-endpoints)

## Installation

### Prerequisites

-   Node.js
-   MongoDB

### Steps

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/BhupendraLute/job-portal.git
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```
        
3. **Set up environment variables:** Create a ***.env*** file in the server directory and add the required environment variables, such as:
    ```json
    PORT=8000
    MONGODB_URI=mongodb:"Your MongoDB URI"
    CORS_ORIGIN=*
    ACCESS_TOKEN_SECRET="any secret string"
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET="any secret string"
    REFRESH_TOKEN_EXPIRY=10d

    CLOUDINARY_CLOUD_NAME=""
    CLOUDINARY_API_KEY=""
    CLOUDINARY_API_SECRET=""
    ```

4. Start the server:
    ```bash
    npm start
    ```
    The server should now be running at [http://localhost:8000](http://localhost:8000)
---

## API Endpoints

-  Base url : http://localhost:8000/api/v1

### User

- Register : ```POST : /users/register```

    #### Request body :
    - firstName : String
    - middleName : String
    - lastName : String
    - username : String
    - avatar : File - pdf
    - email : String
    - password : String
    - role : String
    - dob : Date
    ---

- Login : ```POST : /users/login```

    #### Request body :
    - email : String
    - password : String
    ---

- Logout : ```POST : /users/logout```

- Token refreh for session access : ```POST : /users/refresh-token```

- Change password : ```POST : /users/change-password```

    #### Request body :
    - oldPassword : String
    - newPassword : String
    ---

- Get current user : ```GET : /users/current-user```

- Update account : ```PATCH : /users/update-account```
    
    #### Request body :
    - firstName : String
    - middleName : String
    - lastName : String
    - email : String
    - dob : Date
    ---

- Update avatar : ```PATCH : /users/update-avatar```

    #### Request body :
    - avatar : File - pdf
    ---

- Update resume : ```PATCH : /users/update-resume```

    #### Request body :
    - resume : File - pdf
    ---

- Add experience : ```POST : /users/add-experience```

    #### Request body :
    - company : String
    - position : String
    - startDate : Date
    - endDate : Date
    - description : String
    ---

- Edit experience : ```PATCH : /users/edit-experience/:id```

    #### Note :
    - :id = User experience Id

    #### Request body :
    - company : String
    - position : String
    - startDate : Date
    - endDate : Date
    - description : String
    ---

### Job Post

- Create : ```POST : /job-posts/create```

    #### Request body :
    - title : String
    - company : String
    - description : String
    - jobType : String
    - salary : String
    - location : String
    - applicationDeadline : Date
    ---

- Update : ```PATCH : /job-posts/update/:id```
    #### Note :
    - :id = Job post Id

    #### Request body :
    - title : String
    - company : String
    - description : String
    - jobType : String
    - salary : String
    - location : String
    - applicationDeadline : Date
    ---

- Get Job by Id : ```GET : /job-posts/get/:id```
    #### Note :
    - :id = Job post Id
    ---

- Get All Jobs : ```GET : /job-posts/get-all```

- Search : ```GET : /job-posts/search```
    
    #### Query Params for search
    - q = Search query
    - limit = limit per request
    - page = page number
    ---

- Get Job Apllications : ```GET : /job-posts/applications/:id```

    #### Note :
    - :id = Job post Id
    ---

- Delete Job Apllications : ```DELETE : /job-posts/delete/:id```

    #### Note :
    - :id = Job post Id
    ---

- Apply Job as Jobseeker : ```PATCH : /job-posts/apply/:id```

    #### Note :
    - :id = Job post Id

    #### Request body :
    - resume : File - pdf only
    ---

- Review application as employer : ```PATCH : /job-posts/update-job-status/:id```

    #### Note :
    - :id = Job Application Id

    #### Request body :
    - status : String - pending | accepted | rejected
    ---
---