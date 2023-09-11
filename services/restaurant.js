const restaurant = (db) => {

    async function getTables() {
        // get all the available tables
        await db.any("SELECT * FROM table_booking");
    }

    async function bookTable(tableName) {
        await db.any("SELECT table_name FROM table_booking");
        // book a table by name
    }

    async function getBookedTables() {
        await db.any("SELECT booked FROM table_booking");
        // get all the booked tables
    }

    async function isTableBooked(tableName) {
        await db.any("SELECT booked () FROM table_booking");
        // get booked table by name
    }

    async function cancelTableBooking(tableName) {
        await db.any("DELETE FROM table_booking");
        // cancel a table by name
    }

    async function getBookedTablesForUser(username) {
        await db.any("SELECT FROM ")
        // get user table booking
    }

    return {
        getTables,
        bookTable,
        getBookedTables,
        isTableBooked,
        cancelTableBooking,
        getBookedTablesForUser
    }
}

export default restaurant;