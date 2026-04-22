CREATE DATABASE taxi_cab_db;
USE taxi_cab_db;

-- C01: User Management
CREATE TABLE users (
    user_id     INT AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(15),
    user_type   ENUM('passenger', 'driver', 'admin') DEFAULT 'passenger',
    status      ENUM('active', 'inactive') DEFAULT 'active',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- C02: Driver Management
CREATE TABLE drivers (
    driver_id      INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    vehicle_type   VARCHAR(50),
    vehicle_plate  VARCHAR(20),
    availability   ENUM('available', 'busy', 'offline') DEFAULT 'available',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- C03: Ride Booking
CREATE TABLE rides (
    ride_id          INT AUTO_INCREMENT PRIMARY KEY,
    passenger_id     INT NOT NULL,
    driver_id        INT,
    pickup_location  VARCHAR(255) NOT NULL,
    dropoff_location VARCHAR(255) NOT NULL,
    ride_type        ENUM('standard', 'premium') DEFAULT 'standard',
    status           ENUM('pending','accepted','ongoing','completed','cancelled') DEFAULT 'pending',
    booked_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    fare             DECIMAL(10,2),
    FOREIGN KEY (passenger_id) REFERENCES users(user_id),
    FOREIGN KEY (driver_id)    REFERENCES drivers(driver_id)
);

-- C04: Payment Management
CREATE TABLE payments (
    payment_id   INT AUTO_INCREMENT PRIMARY KEY,
    ride_id      INT NOT NULL,
    passenger_id INT NOT NULL,
    amount       DECIMAL(10,2) NOT NULL,
    method       ENUM('cash', 'card', 'wallet') DEFAULT 'cash',
    status       ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    paid_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id)      REFERENCES rides(ride_id),
    FOREIGN KEY (passenger_id) REFERENCES users(user_id)
);

-- C05: Admin Management
CREATE TABLE admins (
    admin_id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    permissions VARCHAR(255) DEFAULT 'all',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- C06: Feedback & Reviews
CREATE TABLE reviews (
    review_id    INT AUTO_INCREMENT PRIMARY KEY,
    ride_id      INT NOT NULL,
    passenger_id INT NOT NULL,
    driver_id    INT NOT NULL,
    rating       INT CHECK (rating BETWEEN 1 AND 5),
    comment      TEXT,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id)      REFERENCES rides(ride_id),
    FOREIGN KEY (passenger_id) REFERENCES users(user_id),
    FOREIGN KEY (driver_id)    REFERENCES drivers(driver_id)
);
CREATE DATABASE taxi_cab_db;
USE taxi_cab_db;

-- C01: User Management
CREATE TABLE users (
    user_id     INT AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(15),
    user_type   ENUM('passenger', 'driver', 'admin') DEFAULT 'passenger',
    status      ENUM('active', 'inactive') DEFAULT 'active',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- C02: Driver Management
CREATE TABLE drivers (
    driver_id      INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    vehicle_type   VARCHAR(50),
    vehicle_plate  VARCHAR(20),
    availability   ENUM('available', 'busy', 'offline') DEFAULT 'available',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- C03: Ride Booking
CREATE TABLE rides (
    ride_id          INT AUTO_INCREMENT PRIMARY KEY,
    passenger_id     INT NOT NULL,
    driver_id        INT,
    pickup_location  VARCHAR(255) NOT NULL,
    dropoff_location VARCHAR(255) NOT NULL,
    ride_type        ENUM('standard', 'premium') DEFAULT 'standard',
    status           ENUM('pending','accepted','ongoing','completed','cancelled') DEFAULT 'pending',
    booked_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    fare             DECIMAL(10,2),
    FOREIGN KEY (passenger_id) REFERENCES users(user_id),
    FOREIGN KEY (driver_id)    REFERENCES drivers(driver_id)
);

-- C04: Payment Management
CREATE TABLE payments (
    payment_id   INT AUTO_INCREMENT PRIMARY KEY,
    ride_id      INT NOT NULL,
    passenger_id INT NOT NULL,
    amount       DECIMAL(10,2) NOT NULL,
    method       ENUM('cash', 'card', 'wallet') DEFAULT 'cash',
    status       ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    paid_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id)      REFERENCES rides(ride_id),
    FOREIGN KEY (passenger_id) REFERENCES users(user_id)
);

-- C05: Admin Management
CREATE TABLE admins (
    admin_id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    permissions VARCHAR(255) DEFAULT 'all',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- C06: Feedback & Reviews
CREATE TABLE reviews (
    review_id    INT AUTO_INCREMENT PRIMARY KEY,
    ride_id      INT NOT NULL,
    passenger_id INT NOT NULL,
    driver_id    INT NOT NULL,
    rating       INT CHECK (rating BETWEEN 1 AND 5),
    comment      TEXT,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id)      REFERENCES rides(ride_id),
    FOREIGN KEY (passenger_id) REFERENCES users(user_id),
    FOREIGN KEY (driver_id)    REFERENCES drivers(driver_id)
);
