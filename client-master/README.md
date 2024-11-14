# FastAPI Client and Contacts Management API

This is a FastAPI-based API for managing clients and their associated contacts. The application uses MySQL as the database backend and supports operations such as creating, reading, updating, and deleting clients and their contacts.

## Features

1. **Create a client with multiple contacts** (POST `/clients`)
2. **Get all clients with their contacts** (GET `/clients`)
3. **Get a specific client by ID** (GET `/clients/{client_id}`)
4. **Update a client by ID** (PUT `/clients/{client_id}`)
5. **Delete a client by ID** (DELETE `/clients/{client_id}`)

## Requirements

- Python 3.8+
- FastAPI
- Uvicorn
- MySQL
- MySQL Connector for Python
- Pydantic
- python-dotenv

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/fastapi-client-contacts-api.git
    cd fastapi-client-contacts-api
    ```

2. Install the required Python packages:

    ```bash
    pip install -r requirements.txt
    ```

3. Create a `.env` file in the project root and provide the following environment variables for MySQL configuration:

    ```bash
    MYSQL_HOST=your_mysql_host
    MYSQL_USER=your_mysql_user
    MYSQL_PASSWORD=your_mysql_password
    MYSQL_DB=your_mysql_database
    ```

4. Set up your MySQL database and create the necessary tables:

    ```sql
    CREATE TABLE clients (
        cl_id CHAR(36) PRIMARY KEY,
        cl_name VARCHAR(255) NOT NULL,
        cl_email VARCHAR(255),
        cl_phno VARCHAR(20),
        cl_addr TEXT,
        cl_map_url TEXT,
        cl_type VARCHAR(50),
        cl_notes TEXT,
        created_by VARCHAR(255)
    );

    CREATE TABLE contacts (
        co_id CHAR(36) PRIMARY KEY,
        co_name VARCHAR(255) NOT NULL,
        co_position_hr VARCHAR(255),
        co_email VARCHAR(255),
        co_phno VARCHAR(20),
        cl_id CHAR(36),
        FOREIGN KEY (cl_id) REFERENCES clients(cl_id) ON DELETE CASCADE
    );
    ```

## Usage

To run the application, use the following command:

```bash
uvicorn main:app --reload
```

Access the API at `http://localhost:8005`. You can also interact with the API using tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/).

## Error Handling

The API returns appropriate HTTP status codes and error messages in case of failures, such as:
- `404 Not Found`: If the requested resource (client or requirement) is not found.
- `500 Internal Server Error`: For issues with database connections or queries.

## License

This project is licensed under the "....." License. See the [LICENSE](LICENSE) file for details.

## Contact

For any queries or support, please reach out to sandeeprajendra00@gmail.com

