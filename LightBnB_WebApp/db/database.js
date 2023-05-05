const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

// pool.query(`SELECT title FROM properties LIMIT 10;`).then((response) => {
//   console.log(response);
// });

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users WHERE email = '${email}'`)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log("Error", err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  // return Promise.resolve(users[id]);
  return pool
    .query(`SELECT * FROM users WHERE id = '${id}'`)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log("Error", err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool
    .query(
      `INSERT INTO users (name, email, password)
      VALUES('${user.name}', '${user.email}', '${user.password}');`
    )
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log("Error", err.message);
    });
};

/// Reservations

// .query(
//   `SELECT properties.title, properties.number_of_bedrooms, properties.number_of_bathrooms, properties.parking_spaces, properties.cost_per_night, reservations.start_date, reservations.end_date, avg(rating) as average_rating
//   FROM reservations
//   JOIN properties ON reservations.property_id = properties.id
//   JOIN property_reviews ON properties.id = property_reviews.property_id
//   JOIN users ON users.id = reservations.guest_id
//   WHERE reservations.guest_id = ${guest_id}
//   ORDER BY reservations.start_date
//   LIMIT ${limit};`
// )

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(
      `SELECT properties.thumbnail_photo_url, properties.title, properties.number_of_bedrooms, properties.number_of_bathrooms, properties.parking_spaces, properties.cost_per_night, reservations.start_date, reservations.end_date, avg(rating) as average_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      JOIN users ON users.id = reservations.guest_id
      WHERE reservations.guest_id = '${guest_id}'
      GROUP BY properties.id, reservations.id
      ORDER BY reservations.start_date
      LIMIT ${limit};`
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log("Error", err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      // console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log("Error", err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
