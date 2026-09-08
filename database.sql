IF DB_ID('StudentManagement') IS NULL
BEGIN
    CREATE DATABASE StudentManagement;
END
GO

USE StudentManagement;
GO

IF OBJECT_ID('dbo.students', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.students (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        roll_no VARCHAR(50) NOT NULL UNIQUE,
        course VARCHAR(100) NOT NULL,
        email VARCHAR(100) NULL
    );
END
GO

SELECT * FROM dbo.students ORDER BY id ASC;
GO
