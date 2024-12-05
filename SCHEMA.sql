CREATE DATABASE IF NOT EXISTS draftDB;
USE draftDB;

CREATE TABLE employees (
        name VARCHAR(14) NOT NULL,
        id CHAR(10) NOT NULL,
        CONSTRAINT employee_id_check CHECK (id REGEXP '^[A-Z][0-9]{9}$'),
        grade VARCHAR(10) NOT NULL,
        pay INT NOT NULL,
        CONSTRAINT payRange CHECK (pay BETWEEN 0 AND 99999999),
        phoneNumber CHAR(14) NOT NULL,
        CONSTRAINT phone_number_check CHECK (phoneNumber REGEXP '^[0-9]{1,4}-[0-9]{1,4}-[0-9]{1,4}-[0-9]{1,4}$'),
        gender CHAR(1) NOT NULL,
        birthday DATE NOT NULL,
        employmentDate DATE NOT NULL,
        address VARCHAR(30) NOT NULL,
        image LONGBLOB NOT NULL,
        PRIMARY KEY (id)
);

CREATE TABLE country (
        id CHAR(6) NOT NULL,
        CONSTRAINT country_id_check CHECK (id REGEXP '^[A-Z]{2}[0-9]{4}$'),
        name VARCHAR(14) NOT NULL,
        continent VARCHAR(6) NOT NULL,
        leadershipName VARCHAR(14) NOT NULL,
        affairsName VARCHAR(14) NOT NULL,
        contactName VARCHAR(14) NOT NULL,
        population VARCHAR(14) NOT NULL,
        CONSTRAINT population_check CHECK (population REGEXP '^[0-9]+$'),
        territorialArea VARCHAR(14) NOT NULL,
        CONSTRAINT territorial_area_check CHECK (territorialArea REGEXP '^[0-9]+$'),
        contact CHAR(14) NOT NULL,
        CONSTRAINT contact_check CHECK (contact REGEXP '^[0-9]+$'),
        is_diploma BOOLEAN NOT NULL,
        PRIMARY KEY (id)
);

CREATE TABLE draft (
        id CHAR(10) NOT NULL,
        CONSTRAINT draft_id_check CHECK (id REGEXP '^[A-Z][0-9]{9}$'),
        FOREIGN KEY (id) REFERENCES employees(id),
        draftedCountryId CHAR(6) NOT NULL,
        CONSTRAINT draft_country_id_check CHECK (draftedCountryId REGEXP '^[A-Z]{2}[0-9]{4}$'),
        FOREIGN KEY (draftedCountryId) REFERENCES country(id),
        name VARCHAR(14) NOT NULL,
        employmentDate DATE NOT NULL,
        nickname VARCHAR(14) NOT NULL,
        PRIMARY KEY(id, draftedCountryId)
);

CREATE TABLE employeeRelatives (
        id CHAR(10) NOT NULL,
        FOREIGN KEY (id) REFERENCES employees(id),
        relativeId CHAR(10) NOT NULL,
        CONSTRAINT relative_id_check CHECK (relativeId REGEXP '^[A-Z][0-9]{9}$'),
        relativeName VARCHAR(14) NOT NULL,
        relativeGender CHAR(1) NOT NULL,
        relationship VARCHAR(6) NOT NULL,
        PRIMARY KEY(id, relativeId)
);

