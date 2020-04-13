-- CREATE DATABASE stonks_db;
-- USE stonks_db;

-- CREATE TABLE stocks(
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     ticker VARCHAR(10) NOT NULL,
--     sharesOwned INT NOT NULL,
-- );


DROP DATABASE IF EXISTS stonks_db;
CREATE DATABASE stonks_db;
USE stonks_db;

CREATE TABLE stocks(
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticker VARCHAR(10) NOT NULL,
    sharesOwned INT NOT NULL,
    buyPrice DECIMAL(10,2) NOT NULL,
    currentPrice DECIMAL(10,2) 
);

INSERT INTO stocks(ticker, sharesOwned, buyPrice, currentPrice) VALUES 
('TSLA', 4, 100.01, 105.02),
('MSFT', 5, 420.02, 405.03),
('AAPL', 10, 69.03, 75.00),
('HD', 1, 900.04, 904.00);
SELECT * from stocks;


delete from stocks where ticker = 'ZNGA';

SET SQL_SAFE_UPDATES = 0;