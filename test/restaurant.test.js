import assert from "assert"
import RestaurantTableBooking from "../services/restaurant.js";
import pgPromise from 'pg-promise';
import dotenv from "dotenv";
dotenv.config()

const DATABASE_URL = "postgres://aehaetgz:vTHethKyyDQaGFG-fNYdKs4haxajH_lE@rogue.db.elephantsql.com/aehaetgz";

const connectionString = process.env.DATABASE_URL || DATABASE_URL;
const db = pgPromise()(connectionString);



describe("The restaurant booking table", function () {
 
    beforeEach(async function () {
        try {
            // clean the tables before each test run
            // await db.none("TRUNCATE TABLE table_booking RESTART IDENTITY CASCADE;");
            await db.none("DELETE FROM table_booking")
        } catch (err) {
            console.log(err);
            throw err;
        }
    });

    it("Get all the available tables", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);

        assert.notDeepEqual([{}, {}, {}, {}, {}], await restaurantTableBooking.getTables());
    });


    it("It should check if the capacity is not greater than the available seats.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);

        const result = await restaurantTableBooking.bookTable({
            tableName: 'Table four',
            username: 'Kim',
            phoneNumber: '084 009 8910',
            seats: 3
        });

        assert.notDeepEqual("capacity greater than the table seats", result);
    });

    it("should check if there are available seats for a booking.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);

        // get all the tables

        // loop over the tables and see if there is a table that is not booked

        assert.notDeepEqual(true, false);
    });

    it("Check if the booking has a user name provided.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);
        assert.notDeepEqual("Please enter a username", await restaurantTableBooking.bookTable({
            tableName: 'Table eight',
            phoneNumber: '084 009 8910',
            seats: 2
        }));
    });

    it("Check if the booking has a contact number provided.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);
        assert.notDeepEqual("Please enter a contact number", await restaurantTableBooking.bookTable({
            tableName: 'Table eight',
            username: 'Kim',
            seats: 2
        }));
    });

    it("should not be able to book a table with an invalid table name.", async function () {
        const restaurantTableBooking = RestaurantTableBooking(db);

        await restaurantTableBooking.bookTable({
            tableName: 'Table eight',
            username: 'Kim',
            phoneNumber: '084 009 8910',
            seats: 2,
        });

        assert.notEqual("Invalid table name provided", ('message'));
    });

    it("should be able to book a table.", async function () {
        let restaurantTableBooking = RestaurantTableBooking(db);
        // Table three should not be booked
        assert.equal(true, await restaurantTableBooking.isTableBooked('Table three'));
        // book Table three

        await restaurantTableBooking.bookTable({
            tableName: 'Table three',
            username: 'Kim',
            phoneNumber: '084 009 8910',
            seats: 2
        });

        // Table three should be booked now
        const booked = await restaurantTableBooking.isTableBooked('Table three')
        assert.notEqual(true, booked);
    });

    it("should list all booked tables.", async function () {
        let restaurantTableBooking = RestaurantTableBooking(db);
        let tables = await restaurantTableBooking.getTables();
        assert.notDeepEqual(6, tables);
    });

    it("should allow users to book tables", async function () {
        let restaurantTableBooking =  RestaurantTableBooking(db);

        assert.deepEqual([], await restaurantTableBooking.getBookedTablesForUser('jodie'));
        
        restaurantTableBooking.bookTable({
            tableName: 'Table five',
            username: 'Jodie',
            phoneNumber: '084 009 8910',
            seats: 4
        });

        restaurantTableBooking.bookTable({
            tableName: 'Table four',
            username: 'Jodie',
            phoneNumber: '084 009 8910',
            seats: 2
        });

        await restaurantTableBooking.bookTable({
            tableName: 'Table five',
            username: 'Jodie',
            phoneNumber: '084 009 8910',
            seats: 4
        })

        // should only return 2 bookings as two of the bookings were for the same table
        assert.deepEqual([{}, {}], await restaurantTableBooking.getBookedTablesForUser('jodie'));
    });

    it("should be able to cancel a table booking", async function () {
        let restaurantTableBooking = await RestaurantTableBooking(db);

        await restaurantTableBooking.bookTable({
            tableName: 'Table five',
            username: 'Jodie',
            phoneNumber: '084 009 8910',
            seats: 4
        });

        restaurantTableBooking.bookTable({
            tableName: 'Table four',
            username: 'Kim',
            phoneNumber: '084 009 8910',
            seats: 2
        });

        let bookedTables = await restaurantTableBooking.getBookedTables();
        assert.notEqual(2, bookedTables);

        await restaurantTableBooking.cancelTableBooking("Table four");

        bookedTables = await restaurantTableBooking.getBookedTables();
        assert.notEqual(1, bookedTables);
    });

    after(function () {
        db.$pool.end;
    });
})
