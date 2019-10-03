webpackHotUpdate("vendor",{

/***/ "../node_modules/nativescript-sqlite/sqlite.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/**************************************************************************************
 * (c) 2015-2019, Master Technology
 * Licensed under the MIT license or contact me for a support, changes, enhancements,
 * and/or if you require a commercial licensing
 *
 * Any questions please feel free to put a issue up on github
 * Nathan@master-technology.com                           http://nativescript.tools
 * Version 2.3.2 - Android
 *************************************************************************************/

/* global global, require, module */


const appModule = __webpack_require__("../node_modules/tns-core-modules/application/application.js");
const fsModule  = __webpack_require__("../node_modules/tns-core-modules/file-system/file-system.js");


/*jshint undef: true */
/*global java, android, Promise */

// Needed for Creating Database - Android Specific flag
//var CREATEIFNEEDED = 0x10000000;

// Used to track any plugin Init
let _DatabasePluginInits = [];


/***
 * Parses a Row of data into a JS Array (as Native)
 * @param cursor {Object}
 * @returns {Array}
 */
function DBGetRowArrayNative(cursor) {
    //noinspection JSUnresolvedFunction
    let count = cursor.getColumnCount();
    let results = [];
    for (let i=0;i<count;i++) {
        const type = cursor.getType(i);
        switch (type) {
            case 0: // NULL
                results.push(null);
                break;

            case 1: // Integer
                //noinspection JSUnresolvedFunction
                results.push(cursor.getLong(i));
                break;

            case 2: // Float
                //noinspection JSUnresolvedFunction
                results.push(cursor.getFloat(i));
                break;

            case 3: // String
                //noinspection JSUnresolvedFunction
                results.push(cursor.getString(i));
                break;

            case 4: // Blob
                // noinspection JSCheckFunctionSignatures
                results.push(cursor.getBlob(i));
                break;

            default:
                throw new Error('SQLITE - Unknown Field Type ' + type);
        }
    }
    return results;
}

/***
 * Parses a Row of data into a JS Array (as String)
 * @param cursor
 * @returns {Array}
 */
function DBGetRowArrayString(cursor) {
    //noinspection JSUnresolvedFunction
    let count = cursor.getColumnCount();
    let results = [];
    for (let i=0;i<count;i++) {
        const type = cursor.getType(i);
        switch (type) {
            case 0: // NULL
                results.push(null);
                break;

            case 1: // Integer
                //noinspection JSUnresolvedFunction
                results.push(cursor.getString(i));
                break;

            case 2: // Float
                //noinspection JSUnresolvedFunction
                results.push(cursor.getString(i));
                break;

            case 3: // String
                //noinspection JSUnresolvedFunction
                results.push(cursor.getString(i));
                break;

            case 4: // Blob
                // noinspection JSCheckFunctionSignatures
                results.push(cursor.getBlob(i));
                break;

            default:
                throw new Error('SQLITE - Unknown Field Type ' + type);
        }
    }
    return results;
}

/***
 * Parses a Row of data into a JS Object (as Native)
 * @param cursor
 * @returns {{}}
 */
function DBGetRowObjectNative(cursor) {
    //noinspection JSUnresolvedFunction
    const count = cursor.getColumnCount();
    let results = {};
    for (let i=0;i<count;i++) {
        const type = cursor.getType(i);
        //noinspection JSUnresolvedFunction
        const name = cursor.getColumnName(i);
        switch (type) {
            case 0: // NULL
                results[name] = null;
                break;

            case 1: // Integer
                //noinspection JSUnresolvedFunction
                results[name] = cursor.getLong(i);
                break;

            case 2: // Float
                //noinspection JSUnresolvedFunction
                results[name] = cursor.getFloat(i);
                break;

            case 3: // String
                //noinspection JSUnresolvedFunction
                results[name] = cursor.getString(i);
                break;

            case 4: // Blob
                // noinspection JSCheckFunctionSignatures
                results[name] = cursor.getBlob(i);
                break;

            default:
                throw new Error('SQLITE - Unknown Field Type '+ type);
        }
    }
    return results;
}

/***
 * Parses a Row of data into a JS Object (as String)
 * @param cursor
 * @returns {{}}
 */
function DBGetRowObjectString(cursor) {
    //noinspection JSUnresolvedFunction
    const count = cursor.getColumnCount();
    let results = {};
    for (let i=0;i<count;i++) {
        const type = cursor.getType(i);
        //noinspection JSUnresolvedFunction
        const name = cursor.getColumnName(i);
        switch (type) {
            case 0: // NULL
                results[name] = null;
                break;

            case 1: // Integer
                //noinspection JSUnresolvedFunction
                results[name] = cursor.getString(i);
                break;

            case 2: // Float
                //noinspection JSUnresolvedFunction
                results[name] = cursor.getString(i);
                break;

            case 3: // String
                //noinspection JSUnresolvedFunction
                results[name] = cursor.getString(i);
                break;

            case 4: // Blob
                // noinspection JSCheckFunctionSignatures
                results[name] = cursor.getBlob(i);
                break;

            default:
                throw new Error('SQLITE - Unknown Field Type '+ type);
        }
    }
    return results;
}

// Default Resultset engine
let DBGetRowResults = DBGetRowArrayNative;

function setResultValueTypeEngine(resultType, valueType) {
    if (resultType === Database.RESULTSASOBJECT) {
        if (valueType === Database.VALUESARENATIVE) {
            DBGetRowResults = DBGetRowObjectNative;
        } else {
            DBGetRowResults = DBGetRowObjectString;
        }
    } else { // RESULTSASARRAY
        if (valueType === Database.VALUESARENATIVE) {
            DBGetRowResults = DBGetRowArrayNative;
        } else {
            DBGetRowResults = DBGetRowArrayString;
        }
    }
}

/***
 * Database Constructor
 * @param dbname - Database Name
 * @param callback - Callback when Done
 * @param options
 * @returns {Promise} object
 * @constructor
 */
function Database(dbname, options, callback) {
	if (!this instanceof Database) { // jshint ignore:line
		//noinspection JSValidateTypes
		return new Database(dbname, options, callback);
	}
	this._isOpen = false;
	this._resultType = Database.RESULTSASARRAY;
	this._valuesType = Database.VALUESARENATIVE;


	if (typeof options === 'function') {
		callback = options;
		//noinspection JSUnusedAssignment
		options = {};
	} else {
		//noinspection JSUnusedAssignment
		options = options || {};
	}

    //noinspection JSUnresolvedVariable
    if (options && options.multithreading && typeof global.Worker === 'function') {
	       // We don't want this passed into the worker; to try and start another worker (which would fail).
	        delete options.multithreading;
	        if (!Database.HAS_COMMERCIAL) {
	            throw new Error("Commercial only feature; see http://nativescript.tools/product/10");
            }
            return new Database._multiSQL(dbname, options, callback);
    }


	// Check to see if it has a path, or if it is a relative dbname
	// dbname = "" - Temporary Database
	// dbname = ":memory:" = memory database
	if (dbname !== "" && dbname !== ":memory:") {
		//var pkgName = appModule.android.context.getPackageName();
		//noinspection JSUnresolvedFunction
		dbname = _getContext().getDatabasePath(dbname).getAbsolutePath().toString();
		let path = dbname.substr(0, dbname.lastIndexOf('/') + 1);

		// Create "databases" folder if it is missing.  This causes issues on Emulators if it is missing
		// So we create it if it is missing

		try {
            //noinspection JSUnresolvedFunction,JSUnresolvedVariable
            let javaFile = new java.io.File(path);
			if (!javaFile.exists()) {
				//noinspection JSUnresolvedFunction
				javaFile.mkdirs();
				//noinspection JSUnresolvedFunction
				javaFile.setReadable(true);
				//noinspection JSUnresolvedFunction
				javaFile.setWritable(true);
			}
		}
		catch (err) {
			console.info("SQLITE.CONSTRUCTOR - Creating DB Folder Error", err);
		}
	}
	const self = this;

	return new Promise(function (resolve, reject) {
		try {
			let flags = 0;
			if (typeof options.androidFlags !== 'undefined') {
				flags = options.androidFlags;
			}
			self._db = self._openDatabase(dbname, flags, options, _getContext());
		} catch (err) {
			console.error("SQLITE.CONSTRUCTOR -  Open DB Error", err);
			if (callback) {
				callback(err, null);
			}
			reject(err);
			return;
		}

		self._isOpen = true;

		let doneCnt = _DatabasePluginInits.length, doneHandled = 0;
		const done = function (err) {
			if (err) {
				doneHandled = doneCnt;  // We don't want any more triggers after this
				if (callback) {
					callback(err, null);
				}
				reject(err);
				return;
			}
			doneHandled++;
			if (doneHandled === doneCnt) {
				if (callback) {
					callback(null, self);
				}
				resolve(self);
			}
		};

		if (doneCnt) {
			try {
				for (let i = 0; i < doneCnt; i++) {
					_DatabasePluginInits[i].call(self, options, done);
				}
			}
			catch (err) {
				done(err);
			}
		} else {
			if (callback) {
				callback(null, self);
			}
			resolve(self);
		}

	});
}

/**
 * Function to handle opening Database
 * @param dbName
 * @param flags
 * @private
 */
Database.prototype._openDatabase = function(dbName, flags) {
	if (dbName === ":memory:") {
		//noinspection JSUnresolvedVariable
		return android.database.sqlite.SQLiteDatabase.create(flags);
	} else {
		//noinspection JSUnresolvedVariable,JSUnresolvedFunction
		return android.database.sqlite.SQLiteDatabase.openDatabase(dbName, null, flags | 0x10000000);
	}
};

/***
 * Constant that this structure is a sqlite structure
 * @type {boolean}
 */
Database.prototype._isSqlite = true;

/***
 * This gets or sets the database version
 * @param valueOrCallback to set or callback(err, version)
 * @returns Promise
 */
Database.prototype.version = function(valueOrCallback) {
    if (typeof valueOrCallback === 'function') {
        return this.get('PRAGMA user_version', function (err, data) {
            valueOrCallback(err, data && parseInt(data[0],10));
        }, Database.RESULTSASARRAY);
    } else if (!isNaN(valueOrCallback+0)) {
        return this.execSQL('PRAGMA user_version='+(valueOrCallback+0).toString());
    } else {
        return this.get('PRAGMA user_version', undefined, undefined, Database.RESULTSASARRAY);
    }
};

/***
 * Is the database currently open
 * @returns {boolean} - true if the db is open
 */
Database.prototype.isOpen = function() {
    return this._isOpen;
};

/***
 * Gets/Sets whether you get Arrays or Objects for the row values
 * @param value - Database.RESULTSASARRAY or Database.RESULTSASOBJECT
 * @returns {number} - Database.RESULTSASARRAY or Database.RESULTSASOBJECT
 */
Database.prototype.resultType = function(value) {
    if (value === Database.RESULTSASARRAY) {
        this._resultType = Database.RESULTSASARRAY;
        setResultValueTypeEngine(this._resultType, this._valuesType);

    } else if (value === Database.RESULTSASOBJECT) {
        this._resultType = Database.RESULTSASOBJECT;
        setResultValueTypeEngine(this._resultType, this._valuesType);
    }
    return this._resultType;
};

/***
 * Gets/Sets whether you get Native or Strings for the row values
 * @param value - Database.VALUESARENATIVE or Database.VALUESARESTRINGS
 * @returns {number} - Database.VALUESARENATIVE or Database.VALUESARESTRINGS
 */
Database.prototype.valueType = function(value) {
    if (value === Database.VALUESARENATIVE) {
        this._valuesType = Database.VALUESARENATIVE;
        setResultValueTypeEngine(this._resultType, this._valuesType);

    } else if (value === Database.VALUESARESTRINGS) {
        this._valuesType = Database.VALUESARESTRINGS;
        setResultValueTypeEngine(this._resultType, this._valuesType);
    }
    return this._valuesType;
};

// noinspection JSUnusedLocalSymbols
/**
 * Dummy transaction function for public version
 * @param callback
 * @returns {Promise}
 */
Database.prototype.begin = function(callback) {
  throw new Error("Transactions are a Commercial version feature.");
};

// noinspection JSUnusedLocalSymbols
/**
 * Dummy prepare function for public version
 * @param sql
 * @returns {*}
 */
Database.prototype.prepare = function(sql) {
	throw new Error("Prepared statements are a Commercial version feature.");
};




/***
 * Closes this database, any queries after this will fail with an error
 * @param callback
 */
Database.prototype.close = function(callback) {

    const self = this;
    return new Promise(function(resolve, reject) {
        if (!self._isOpen) {
            if (callback) {
                callback('SQLITE.CLOSE - Database is already closed');
            }
            reject('SQLITE.CLOSE - Database is already closed');
            return;
        }

        self._db.close();
        self._isOpen = false;
        if (callback) {
            callback(null, null);
        }
        resolve();
    });
};

/***
 * Exec SQL
 * @param sql - sql to use
 * @param params - optional array of parameters
 * @param callback - (err, result) - can be last_row_id for insert, and rows affected for update/delete
 * @returns Promise
 */
Database.prototype.execSQL = function(sql, params, callback) {
    if (typeof params === 'function') {
        callback = params;
        params = undefined;
    }

    const self = this;
    return new Promise(function(resolve, reject) {
        let hasCallback = true;
        if (typeof callback !== 'function') {
            callback = reject;
            hasCallback = false;
        }

        if (!self._isOpen) {
            callback("SQLITE.EXECSQL - Database is not open");
            return;
        }

        // Need to see if we have to run any status queries afterwords
        let flags = 0;
        let test = sql.trim().substr(0, 7).toLowerCase();
        if (test === 'insert ') {
            flags = 1;
        } else if (test === 'update ' || test === 'delete ') {
            flags = 2;
        }

        try {
            if (params !== undefined) {
                self._db.execSQL(sql, self._toStringArray(params));
            } else {
                self._db.execSQL(sql);
            }
        } catch (Err) {
            callback(Err, null);
            return;
        }

        switch (flags) {
            case 0:
                if (hasCallback) {
                    callback(null, null);
                }
                resolve(null);
                break;
            case 1:
                // noinspection JSIgnoredPromiseFromCall
                self.get('select last_insert_rowid()', function (err, data) {
                    if (hasCallback) {
                        callback(err, data && data[0]);
                    }
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data && data[0]);
                    }
                }, Database.RESULTSASARRAY | Database.VALUESARENATIVE);
                break;
            case 2:
                // noinspection JSIgnoredPromiseFromCall
                self.get('select changes()', function (err, data) {
                    if (hasCallback) {
                        callback(err, data && data[0]);
                    }
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data && data[0]);
                    }
                }, Database.RESULTSASARRAY | Database.VALUESARENATIVE);
                break;
            default:
                resolve();
        }

    });
};

/***
 * Get the first record result set
 * @param sql - sql to run
 * @param params - optional
 * @param callback - callback (error, results)
 * @param mode - allows you to manually override the results set to be a array or object
 * @returns Promise
 */
Database.prototype.get = function(sql, params, callback, mode) {
    if (typeof params === 'function') {
        mode = callback;
        callback = params;
        params = undefined;
    }

    const self = this;
    return new Promise(function(resolve, reject) {
        let hasCallback = true;
        if (typeof callback !== 'function') {
            callback = reject;
            hasCallback = false;
        }

        if (!self._isOpen) {
            callback("SQLITE.GET - Database is not open", null);
            return;
        }

        let cursor;
        try {
            if (params !== undefined) {
                //noinspection JSUnresolvedFunction
                cursor = self._db.rawQuery(sql, self._toStringArray(params));
            } else {
                //noinspection JSUnresolvedFunction
                cursor = self._db.rawQuery(sql, null);
            }
        } catch (err) {
            callback(err, null);
            return;
        }

        // No Records
        // noinspection JSUnresolvedFunction
        if (cursor.getCount() === 0) {
            cursor.close();
            if (hasCallback) {
                callback(null, null);
            }
            resolve(null);
            return;
        }

        let results;
        const resultEngine = self._getResultEngine(mode);
        try {
            //noinspection JSUnresolvedFunction
            cursor.moveToFirst();
            results = resultEngine(cursor);
            cursor.close();
        } catch (err) {
            callback(err, null);
            return;
        }
        if (hasCallback) {
            callback(null, results);
        }
        resolve(results);
    });
};

Database.prototype._getResultEngine = function(mode) {
    if (mode == null || mode === 0) return DBGetRowResults;

    let resultType = (mode & Database.RESULTSASARRAY|Database.RESULTSASOBJECT);
    if (resultType === 0) {
        resultType = this._resultType;
    }
    let valueType = (mode & Database.VALUESARENATIVE|Database.VALUESARESTRINGS);
    if (valueType === 0) {
        valueType = this._valuesType;
    }

    if (resultType === Database.RESULTSASOBJECT) {
        if (valueType === Database.VALUESARESTRINGS) {
            return DBGetRowObjectString;
        } else {
            return DBGetRowObjectNative;
        }
    } else {
        if (valueType === Database.VALUESARESTRINGS) {
            return DBGetRowArrayString;
        } else {
            return DBGetRowArrayNative;
        }
    }

};

/***
 * This returns the entire result set in a array of rows
 * @param sql - Sql to run
 * @param params - optional
 * @param callback - (err, results)
 * @returns Promise
 */
Database.prototype.all = function(sql, params, callback) {
    if (typeof params === 'function') {
        callback = params;
        params = undefined;
    }

    const self = this;
    return new Promise(function(resolve, reject) {
        let hasCallback = true;
        if (typeof callback !== 'function') {
            callback = reject;
            hasCallback = false;
        }

        if (!self._isOpen) {
            callback("SQLITE.ALL - Database is not open");
            return;
        }

        let cursor, count;
        try {
            if (params !== undefined) {
                //noinspection JSUnresolvedFunction
                cursor = self._db.rawQuery(sql, self._toStringArray(params));
            } else {
                //noinspection JSUnresolvedFunction
                cursor = self._db.rawQuery(sql, null);
            }
            // noinspection JSUnresolvedFunction
            count = cursor.getCount();
        } catch (err) {
            callback(err);
            return;
        }


        // No Records
        if (count === 0) {
            cursor.close();
            if (hasCallback) {
                callback(null, []);
            }
            resolve([]);
            return;
        }
        //noinspection JSUnresolvedFunction
        cursor.moveToFirst();

        let results = [];
        try {
            for (let i = 0; i < count; i++) {
                const data = DBGetRowResults(cursor); // jshint ignore:line
                results.push(data);
                //noinspection JSUnresolvedFunction
                cursor.moveToNext();
            }
            cursor.close();
        } catch (err) {
            callback(err);
            return;
        }
        if (hasCallback) {
            callback(null, results);
        }
        resolve(results);
    });
};

/***
 * This sends each row of the result set to the "Callback" and at the end calls the complete callback upon completion
 * @param sql - sql to run
 * @param params - optional
 * @param callback - callback (err, rowsResult)
 * @param complete - callback (err, recordCount)
 * @returns Promise
 */
Database.prototype.each = function(sql, params, callback, complete) {
    if (typeof params === 'function') {
        complete = callback;
        callback = params;
        params = undefined;
    }

    // Callback is required
    if (typeof callback !== 'function') {
        throw new Error("SQLITE.EACH - requires a callback");
    }

    const self = this;
    return new Promise(function (resolve, reject) {

        // Set the error Callback
        let errorCB = complete || callback;

        let cursor, count;
        try {
            if (params !== undefined) {
                //noinspection JSUnresolvedFunction
                cursor = self._db.rawQuery(sql, self._toStringArray(params));
            } else {
                //noinspection JSUnresolvedFunction
                cursor = self._db.rawQuery(sql, null);
            }
            // noinspection JSUnresolvedFunction
            count = cursor.getCount();
        } catch (err) {
            errorCB(err, null);
            reject(err);
            return;
        }

        // No Records
        if (count === 0) {
            cursor.close();
            if (complete) {
                complete(null, 0);
            }
            resolve(0);
            return;
        }
        //noinspection JSUnresolvedFunction
        cursor.moveToFirst();

        try {
            for (let i = 0; i < count; i++) {
                const data = DBGetRowResults(cursor); // jshint ignore:line
                callback(null, data);
                //noinspection JSUnresolvedFunction
                cursor.moveToNext();
            }
            cursor.close();
        } catch (err) {
            errorCB(err, null);
            reject(err);
            return;
        }
        if (complete) {
            complete(null, count);
        }
        resolve(count);
    });
};

/***
 * Converts a Mixed Array to a String Array
 * @param params
 * @returns {Array}
 * @private
 */
Database.prototype._toStringArray = function(params) {
    let stringParams = [];
    if (Object.prototype.toString.apply(params) === '[object Array]') {
        const count = params.length;
        for (let i=0; i<count; ++i) {
            if (params[i] == null) { // jshint ignore:line
                stringParams.push(null);
            } else {
                stringParams.push(params[i].toString());
            }
        }
    } else {
        if (params == null) { // jshint ignore:line
            stringParams.push(null);
        } else {
            stringParams.push(params.toString());
        }
    }
    return stringParams;
};

/***
 * Is this a SQLite object
 * @param obj - possible sqlite object to check
 * @returns {boolean}
 */
Database.isSqlite = function(obj) {
    return obj && obj._isSqlite;
};

/**
 * Does this database exist on disk
 * @param name
 * @returns {*}
 */
Database.exists = function(name) {
    //noinspection JSUnresolvedFunction
    const dbName = _getContext().getDatabasePath(name).getAbsolutePath();
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const dbFile = new java.io.File(dbName);
    // noinspection JSUnresolvedFunction
    return dbFile.exists();
};

/**
 * Delete the database file if it exists
 * @param name
 */
Database.deleteDatabase = function(name) {
    //noinspection JSUnresolvedFunction
    const dbName = _getContext().getDatabasePath(name).getAbsolutePath();
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    let dbFile = new java.io.File(dbName);
    if (dbFile.exists()) {
        dbFile.delete();
        // noinspection JSUnresolvedFunction,JSUnresolvedVariable
        dbFile = new java.io.File(dbName + '-journal');
        if (dbFile.exists()) {
            dbFile.delete();
        }
    }
};

/**
 * Copy the database from the install location
 * @param name
 */
Database.copyDatabase = function(name) {

    //Open your local db as the input stream
    let myInput;
    try {
        // Attempt to use the local app directory version
        // noinspection JSUnresolvedFunction,JSUnresolvedVariable
        myInput = new java.io.FileInputStream(fsModule.knownFolders.currentApp().path + '/' + name);
    }
    catch (err) {
        // Use the Assets version
        // noinspection JSUnresolvedFunction
        myInput = _getContext().getAssets().open("app/"+name);
    }

     
    if (name.indexOf('/')) {
        name = name.substring(name.lastIndexOf('/')+1);
    }

    //noinspection JSUnresolvedFunction
    const dbName = _getContext().getDatabasePath(name).getAbsolutePath();
    const path = dbName.substr(0, dbName.lastIndexOf('/') + 1);

    // Create "databases" folder if it is missing.  This causes issues on Emulators if it is missing
    // So we create it if it is missing

    try {
        // noinspection JSUnresolvedFunction,JSUnresolvedVariable
        const javaFile = new java.io.File(path);
        //noinspection JSUnresolvedFunction
        if (!javaFile.exists()) {
            //noinspection JSUnresolvedFunction
            javaFile.mkdirs();
            //noinspection JSUnresolvedFunction
            javaFile.setReadable(true);
            //noinspection JSUnresolvedFunction
            javaFile.setWritable(true);
        }
    }
    catch (err) {
        console.info("SQLITE - COPYDATABASE - Creating DB Folder Error", err);
    }

    //Open the empty db as the output stream
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const myOutput = new java.io.FileOutputStream(dbName);


    let success = true;
    try {
        //transfer bytes from the input file to the output file
        //noinspection JSUnresolvedFunction,JSUnresolvedVariable
        let buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.class.getField("TYPE").get(null), 1024);
        let length;
        while ((length = myInput.read(buffer)) > 0) {
            // noinspection JSUnresolvedFunction
            myOutput.write(buffer, 0, length);
        }
    }
    catch (err) {
        success = false;
    }


    //Close the streams
    // noinspection JSUnresolvedFunction
    myOutput.flush();
    // noinspection JSUnresolvedFunction
    myOutput.close();
    myInput.close();
    return success;
};

// Literal Defines
Database.RESULTSASARRAY  = 1;
Database.RESULTSASOBJECT = 2;
Database.VALUESARENATIVE = 4;
Database.VALUESARESTRINGS = 8;

TryLoadingCommercialPlugin();
TryLoadingEncryptionPlugin();

module.exports = Database;

/**
 * gets the current application context
 * @returns {*}
 * @private
 */
function _getContext() {
    if (appModule.android.context) {
        return (appModule.android.context);
    }
    if (typeof appModule.getNativeApplication === 'function') {
        let ctx = appModule.getNativeApplication();
        if (ctx) {
            return ctx;
        }
    }


    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    ctx = java.lang.Class.forName("android.app.AppGlobals").getMethod("getInitialApplication", null).invoke(null, null);
    if (ctx) return ctx;

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    ctx = java.lang.Class.forName("android.app.ActivityThread").getMethod("currentApplication", null).invoke(null, null);
    if (ctx) return ctx;

    return ctx;
}

/** Uses a SQLite Plugin **/
function UsePlugin(loadedSrc, DBModule) {
		if (loadedSrc.prototypes) {
			for (let key in loadedSrc.prototypes) {
			    if (!loadedSrc.prototypes.hasOwnProperty(key)) { continue; }
				DBModule.prototype[key] = loadedSrc.prototypes[key];
			}
		}
		if (loadedSrc.statics) {
			for (let key in loadedSrc.statics) {
                if (!loadedSrc.statics.hasOwnProperty(key)) { continue; }
                DBModule[key] = loadedSrc.statics[key];
			}
		}
		if (typeof loadedSrc.init === 'function') {
			_DatabasePluginInits.push(loadedSrc.init);
		}
}

function TryLoadingCommercialPlugin() {
	try {
		const sqlCom = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'nativescript-sqlite-commercial'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
		UsePlugin(sqlCom, Database);
	}
	catch (e) { /* Do Nothing if it doesn't exist as it is an optional plugin */
	}
}

function TryLoadingEncryptionPlugin() {
	try {
		const sqlEnc = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'nativescript-sqlite-encrypted'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
		UsePlugin(sqlEnc, Database);
	}
	catch (e) { /* Do Nothing if it doesn't exist as it is an optional plugin */
	}
}
; 
if ( true && global._isModuleLoadedForUI && global._isModuleLoadedForUI("C:/develop/MAPforPAD/node_modules/nativescript-sqlite/sqlite.js") ) {
    
    module.hot.accept();
    module.hot.dispose(() => {
        global.hmrRefresh({ type: "script", path: "C:/develop/MAPforPAD/node_modules/nativescript-sqlite/sqlite.js" });
    });
} 
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/nativescript-webview-interface/index-common.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Parses json string to object if valid.
 */
function parseJSON(data) {
    var oData;
    try {
        oData = JSON.parse(data);
    } catch (e) {
        return false;
    }
    return oData;
}

/**
 * WebViewInterface Class containing common functionalities for Android and iOS
 */
function WebViewInterface(webView) {
    /**
     * WebView to setup interface for
     */
    this.webView = webView;
    
    /**
     * Mapping of webView event/command and its native handler 
     */
    this.eventListenerMap = {};
    
    /**
     * Mapping of js call request id and its success handler. 
     * Based on this mapping, the registered success handler will be called 
     * on successful response from the js call
     */
    this.jsCallReqIdSuccessCallbackMap = {};
    
    /**
     * Mapping of js call request id and its error handler. 
     * Based on this mapping, the error handler will be called 
     * on error from the js call
     */
    this.jsCallReqIdErrorCallbackMap = {};
    
    /**
     * Web-view instance unique id to handle scenarios of multiple webview on single page.
     */
    this.id = ++WebViewInterface.cntWebViewId;
    
    /**
     * Maintaining mapping of webview instance and its id, to handle scenarios of multiple webview on single page.
     */
    WebViewInterface.webViewInterfaceIdMap[this.id] = this;
}

/**
 * Prepares call to a function in webView, which handles native event/command calls
 */
WebViewInterface.prototype._prepareEmitEventJSCall = function (eventName, data) {
    data = JSON.stringify(data);    // calling stringify for all types of data. Because if data is a string containing ", we need to escape that. Ref: https://github.com/shripalsoni04/nativescript-webview-interface/pull/6
    return 'window.nsWebViewInterface._onNativeEvent("' + eventName + '",' + data + ');'
};

/**
 * Prepares call to a function in webView, which calls the specified function in the webView
 */
WebViewInterface.prototype._prepareJSFunctionCall = function (functionName, arrArgs, successHandler, errorHandler) {
    arrArgs = arrArgs || [];
    
    // converts non array argument to array
    if (typeof arrArgs !== 'object' || arrArgs.length === void (0)) {
        arrArgs = [arrArgs];
    }
    var strArgs = JSON.stringify(arrArgs);
    // creating id with combination of web-view id and req id
    var reqId = '"'+this.id+'#'+ (++WebViewInterface.cntJSCallReqId)+'"';
    this.jsCallReqIdSuccessCallbackMap[reqId] = successHandler;
    this.jsCallReqIdErrorCallbackMap[reqId] = errorHandler;
    return 'window.nsWebViewInterface._callJSFunction(' + reqId + ',"' + functionName + '",' + strArgs + ');'
}

/**
 * Handles response/event/command from webView.
 */
WebViewInterface.prototype._onWebViewEvent = function (eventName, data) {
    var oData = parseJSON(data) || data;
    
    // in case of JS call result, eventName will be _jsCallResponse
    if (eventName === '_jsCallResponse') {
        var reqId = '"'+oData.reqId+'"';
        var callback;
        
        if(oData.isError){
            callback = this.jsCallReqIdErrorCallbackMap[reqId];
        }else{
            callback = this.jsCallReqIdSuccessCallbackMap[reqId];
        }
        
        if (callback) {
            callback(oData.response);
        }
    } else {
        var lstCallbacks = this.eventListenerMap[eventName] || [];
        for (var i = 0; i < lstCallbacks.length; i++) {
            var retnVal = lstCallbacks[i](oData);
            if (retnVal === false) {
                break;
            }
        }
    }
};

/**
 * Registers handler for event/command emitted from webview
 * @param   {string}    eventName - Any event name except reserved '_jsCallResponse'
 * @param   {function}  callback - Callback function to be executed on event/command receive.
 */
WebViewInterface.prototype.on = function (eventName, callback) {
    if(eventName === '_jsCallResponse'){
        throw new Error('_jsCallResponse eventName is reserved for internal use. You cannot attach listeners to it.');    
    }
    
    (this.eventListenerMap[eventName] || (this.eventListenerMap[eventName] = [])).push(callback);
};

/**
 * Deregisters handler for event/command emitted from webview
 * @param   {string}    eventName - Any event name except reserved '_jsCallResponse'
 * @param   {function}  callback - Callback function to be executed on event/command receive.
 **/
WebViewInterface.prototype.off = function (eventName, callback) {
    if(eventName === '_jsCallResponse'){
        throw new Error('_jsCallResponse eventName is reserved for internal use. You cannot deattach listeners to it.');
    }

    if (!this.eventListenerMap[eventName] || this.eventListenerMap[eventName].length === 0) {
      return;
    }

    if (callback) {
      this.eventListenerMap[eventName] = this.eventListenerMap[eventName].filter(function(oldCallback) {
        return oldCallback !== callback;
      });
    } else {
      delete this.eventListenerMap[eventName];
    }
};

/**
 * Emits event/command with payload to webView.
 * @param   {string}    eventName - Any event name
 * @param   {any}       data - Payload to send wiht event/command
 */
WebViewInterface.prototype.emit = function (eventName, data) {
    var strJSFunction = this._prepareEmitEventJSCall(eventName, data);
    this._executeJS(strJSFunction);
}

/**
 * Calls function in webView
 * @param   {string}    functionName - Function should be in global scope in webView
 * @param   {any[]}     args - Arguments of the function
 * @param   {function}  callback - Function to call on result from webView      
 */
WebViewInterface.prototype.callJSFunction = function (functionName, args, successHandler, errorHandler) {
    var strJSFunction = this._prepareJSFunctionCall(functionName, args, successHandler, errorHandler);
    this._executeJS(strJSFunction);
};

/**
 * Clears mappings of callbacks and webview.
 * This needs to be called in navigatedFrom event handler in page where webviewInterface plugin is used.
 */
WebViewInterface.prototype.destroy = function(){
    // call platform specific destroy function if available. Currently used only for iOS to remove loadStarted event listener.
    if(this._destroy) {
        this._destroy();
    }

    /**
     * 
     * Resetting src to blank. This needs to be done to avoid issue of communication stops working from webView to nativescript when 
     * page with webVeiw is opened on back button press on android.
     * This issue occurs because nativescript destroys the native webView element on navigation if cache is disabled, and when we navigate back
     * it recreates the native webView and attaches it to nativescript webView element. So we have to reinitiate this plugin with new webView instance.
     * Now, to make communication from webVeiw to nativescript work on android, 
     * androidJSInterface should be loaded before any request loads on webView. So if we don't reset src on nativescript webView, that src will start
     * loading as soon as the native webView is created and before we add androidJSInterface. This results in stoppage of communication from webView 
     * to nativescript when page is opened on back navigation.
     */
    if(this.webView) {
        this.webView.src = '';
    }

    this.eventListenerMap = null;
    this.jsCallReqIdSuccessCallbackMap = null;
    this.jsCallReqIdErrorCallbackMap = null;
    delete WebViewInterface.webViewInterfaceIdMap[this.id]; 
};

/**
 * Counter to create unique requestId for each JS call to webView.
 */
WebViewInterface.cntJSCallReqId = 0;
WebViewInterface.cntWebViewId = 0;
WebViewInterface.webViewInterfaceIdMap = {};

exports.WebViewInterface = WebViewInterface;
exports.parseJSON = parseJSON;; 
if ( true && global._isModuleLoadedForUI && global._isModuleLoadedForUI("C:/develop/MAPforPAD/node_modules/nativescript-webview-interface/index-common.js") ) {
    
    module.hot.accept();
    module.hot.dispose(() => {
        global.hmrRefresh({ type: "script", path: "C:/develop/MAPforPAD/node_modules/nativescript-webview-interface/index-common.js" });
    });
} 
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/nativescript-webview-interface/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) { const common = __webpack_require__("../node_modules/nativescript-webview-interface/index-common.js");
 const platformModule = __webpack_require__("../node_modules/tns-core-modules/platform/platform.js");

 global.moduleMerge(common, exports);
 
 /**
  * Factory function to provide instance of Android JavascriptInterface.      
  */ 
 function getAndroidJSInterface(oWebViewInterface){
    var AndroidWebViewInterface = com.shripalsoni.natiescriptwebviewinterface.WebViewInterface.extend({
        /**
         * On call from webView to android, this function is called from handleEventFromWebView method of WebViewInerface class
         */
        onWebViewEvent: function(webViewId, eventName, jsonData){
            // getting webviewInterface object by webViewId from static map.
            var oWebViewInterface = getWebViewIntefaceObjByWebViewId(webViewId);
            if (oWebViewInterface) {
                oWebViewInterface._onWebViewEvent(eventName, jsonData);
            }
        }
    });
    
    // creating androidWebViewInterface with unique web-view id.
    return new AndroidWebViewInterface(new java.lang.String(''+oWebViewInterface.id));
 }
 
 /**
  * Returns webViewInterface object mapped with the passed webViewId.
  */
 function getWebViewIntefaceObjByWebViewId(webViewId){
     return common.WebViewInterface.webViewInterfaceIdMap[webViewId];
 }
 
 /**
  * Android Specific WebViewInterface Class
  */
 var WebViewInterface = (function(_super){
    __extends(WebViewInterface, _super);
    
    function WebViewInterface(webView, src){
        _super.call(this, webView);
        this._initWebView(src); 
    }
    
    /**
     * Initializes webView for communication between android and webView.
     */
    WebViewInterface.prototype._initWebView = function(src){
        var _this = this;
        if(this.webView.isLoaded) {
            _this._setAndroidWebViewSettings(src);
        } else {
            var handlerRef = _this.webView.on('loaded', function(){
                _this._setAndroidWebViewSettings(src);
                _this.webView.off('loaded', handlerRef);
            });
        }
    };
    
    WebViewInterface.prototype._setAndroidWebViewSettings = function(src) {
        var oJSInterface =  getAndroidJSInterface(this);
        var androidSettings = this.webView.android.getSettings();
        androidSettings.setJavaScriptEnabled(true);
        this.webView.android.addJavascriptInterface(oJSInterface, 'androidWebViewInterface');

        // If src is provided, then setting it.
        // To make javascriptInterface available in web-view, it should be set before 
        // web-view's loadUrl method is called. So setting src after javascriptInterface is set.
        if(src){
            this.webView.src = src;
        }
    }

    /**
     * Executes event/command/jsFunction in webView.
     */
    WebViewInterface.prototype._executeJS = function(strJSFunction){
      if (platformModule.device.sdkVersion >= 19) {
        this.webView.android.evaluateJavascript(strJSFunction, null);
      }
      else {
        this.webView.android.loadUrl('javascript:'+strJSFunction);
      }
    };
    
    return WebViewInterface;
 })(common.WebViewInterface);
 
 exports.WebViewInterface = WebViewInterface;
; 
if ( true && global._isModuleLoadedForUI && global._isModuleLoadedForUI("C:/develop/MAPforPAD/node_modules/nativescript-webview-interface/index.js") ) {
    
    module.hot.accept();
    module.hot.dispose(() => {
        global.hmrRefresh({ type: "script", path: "C:/develop/MAPforPAD/node_modules/nativescript-webview-interface/index.js" });
    });
} 
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL25hdGl2ZXNjcmlwdC1zcWxpdGUvc3FsaXRlLmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvbmF0aXZlc2NyaXB0LXdlYnZpZXctaW50ZXJmYWNlL2luZGV4LWNvbW1vbi5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL25hdGl2ZXNjcmlwdC13ZWJ2aWV3LWludGVyZmFjZS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRWE7QUFDYixrQkFBa0IsbUJBQU8sQ0FBQyw2REFBYTtBQUN2QyxrQkFBa0IsbUJBQU8sQ0FBQyw2REFBYTs7O0FBR3ZDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFFBQVE7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsUUFBUTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsUUFBUTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFFBQVE7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUssT0FBTztBQUNaO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixhQUFhO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkJBQTJCLFdBQVc7QUFDdEMscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkIsV0FBVztBQUN0QyxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsU0FBUztBQUM5QixvQ0FBb0M7QUFDcEM7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLDZCQUE2QjtBQUM3QjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxVQUFVO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQsVUFBVTtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLG1CQUFPLENBQUMsd0pBQWdDO0FBQ3pEO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLG1CQUFPLENBQUMsdUpBQStCO0FBQ3hEO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBLEM7QUFDQSxJQUFJLEtBQVU7O0FBRWQ7QUFDQTtBQUNBLDJCQUEyQiwwRkFBMEY7QUFDckgsS0FBSztBQUNMLEM7Ozs7Ozs7O0FDL2dDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQyx1RkFBdUY7QUFDdkY7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0R0FBNEc7QUFDNUc7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsdUJBQXVCLHlCQUF5QjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQSxzSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLElBQUk7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsTUFBTTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwyRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtCO0FBQ0EsSUFBSSxLQUFVOztBQUVkO0FBQ0E7QUFDQSwyQkFBMkIsMkdBQTJHO0FBQ3RJLEtBQUs7QUFDTCxDOzs7Ozs7OztBQ3BOQSw4REFBZ0IsbUJBQU8sQ0FBQyxnRUFBZ0I7QUFDeEMsd0JBQXdCLG1CQUFPLENBQUMsdURBQVU7O0FBRTFDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7O0FBRUY7QUFDQSxDO0FBQ0EsSUFBSSxLQUFVOztBQUVkO0FBQ0E7QUFDQSwyQkFBMkIsb0dBQW9HO0FBQy9ILEtBQUs7QUFDTCxDIiwiZmlsZSI6InZlbmRvci41ZDg3Y2FiNmJkNWU2OGRjNGFhMi5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiAoYykgMjAxNS0yMDE5LCBNYXN0ZXIgVGVjaG5vbG9neVxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIG9yIGNvbnRhY3QgbWUgZm9yIGEgc3VwcG9ydCwgY2hhbmdlcywgZW5oYW5jZW1lbnRzLFxuICogYW5kL29yIGlmIHlvdSByZXF1aXJlIGEgY29tbWVyY2lhbCBsaWNlbnNpbmdcbiAqXG4gKiBBbnkgcXVlc3Rpb25zIHBsZWFzZSBmZWVsIGZyZWUgdG8gcHV0IGEgaXNzdWUgdXAgb24gZ2l0aHViXG4gKiBOYXRoYW5AbWFzdGVyLXRlY2hub2xvZ3kuY29tICAgICAgICAgICAgICAgICAgICAgICAgICAgaHR0cDovL25hdGl2ZXNjcmlwdC50b29sc1xuICogVmVyc2lvbiAyLjMuMiAtIEFuZHJvaWRcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKiBnbG9iYWwgZ2xvYmFsLCByZXF1aXJlLCBtb2R1bGUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5jb25zdCBhcHBNb2R1bGUgPSByZXF1aXJlKFwiYXBwbGljYXRpb25cIik7XG5jb25zdCBmc01vZHVsZSAgPSByZXF1aXJlKFwiZmlsZS1zeXN0ZW1cIik7XG5cblxuLypqc2hpbnQgdW5kZWY6IHRydWUgKi9cbi8qZ2xvYmFsIGphdmEsIGFuZHJvaWQsIFByb21pc2UgKi9cblxuLy8gTmVlZGVkIGZvciBDcmVhdGluZyBEYXRhYmFzZSAtIEFuZHJvaWQgU3BlY2lmaWMgZmxhZ1xuLy92YXIgQ1JFQVRFSUZORUVERUQgPSAweDEwMDAwMDAwO1xuXG4vLyBVc2VkIHRvIHRyYWNrIGFueSBwbHVnaW4gSW5pdFxubGV0IF9EYXRhYmFzZVBsdWdpbkluaXRzID0gW107XG5cblxuLyoqKlxuICogUGFyc2VzIGEgUm93IG9mIGRhdGEgaW50byBhIEpTIEFycmF5IChhcyBOYXRpdmUpXG4gKiBAcGFyYW0gY3Vyc29yIHtPYmplY3R9XG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIERCR2V0Um93QXJyYXlOYXRpdmUoY3Vyc29yKSB7XG4gICAgLy9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cbiAgICBsZXQgY291bnQgPSBjdXJzb3IuZ2V0Q29sdW1uQ291bnQoKTtcbiAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAobGV0IGk9MDtpPGNvdW50O2krKykge1xuICAgICAgICBjb25zdCB0eXBlID0gY3Vyc29yLmdldFR5cGUoaSk7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSAwOiAvLyBOVUxMXG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG51bGwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDE6IC8vIEludGVnZXJcbiAgICAgICAgICAgICAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChjdXJzb3IuZ2V0TG9uZyhpKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMjogLy8gRmxvYXRcbiAgICAgICAgICAgICAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChjdXJzb3IuZ2V0RmxvYXQoaSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDM6IC8vIFN0cmluZ1xuICAgICAgICAgICAgICAgIC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGN1cnNvci5nZXRTdHJpbmcoaSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDQ6IC8vIEJsb2JcbiAgICAgICAgICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNDaGVja0Z1bmN0aW9uU2lnbmF0dXJlc1xuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChjdXJzb3IuZ2V0QmxvYihpKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTUUxJVEUgLSBVbmtub3duIEZpZWxkIFR5cGUgJyArIHR5cGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xufVxuXG4vKioqXG4gKiBQYXJzZXMgYSBSb3cgb2YgZGF0YSBpbnRvIGEgSlMgQXJyYXkgKGFzIFN0cmluZylcbiAqIEBwYXJhbSBjdXJzb3JcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xuZnVuY3Rpb24gREJHZXRSb3dBcnJheVN0cmluZyhjdXJzb3IpIHtcbiAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgIGxldCBjb3VudCA9IGN1cnNvci5nZXRDb2x1bW5Db3VudCgpO1xuICAgIGxldCByZXN1bHRzID0gW107XG4gICAgZm9yIChsZXQgaT0wO2k8Y291bnQ7aSsrKSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBjdXJzb3IuZ2V0VHlwZShpKTtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIDA6IC8vIE5VTExcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gobnVsbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMTogLy8gSW50ZWdlclxuICAgICAgICAgICAgICAgIC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGN1cnNvci5nZXRTdHJpbmcoaSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDI6IC8vIEZsb2F0XG4gICAgICAgICAgICAgICAgLy9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goY3Vyc29yLmdldFN0cmluZyhpKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMzogLy8gU3RyaW5nXG4gICAgICAgICAgICAgICAgLy9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goY3Vyc29yLmdldFN0cmluZyhpKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgNDogLy8gQmxvYlxuICAgICAgICAgICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU0NoZWNrRnVuY3Rpb25TaWduYXR1cmVzXG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGN1cnNvci5nZXRCbG9iKGkpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NRTElURSAtIFVua25vd24gRmllbGQgVHlwZSAnICsgdHlwZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbi8qKipcbiAqIFBhcnNlcyBhIFJvdyBvZiBkYXRhIGludG8gYSBKUyBPYmplY3QgKGFzIE5hdGl2ZSlcbiAqIEBwYXJhbSBjdXJzb3JcbiAqIEByZXR1cm5zIHt7fX1cbiAqL1xuZnVuY3Rpb24gREJHZXRSb3dPYmplY3ROYXRpdmUoY3Vyc29yKSB7XG4gICAgLy9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cbiAgICBjb25zdCBjb3VudCA9IGN1cnNvci5nZXRDb2x1bW5Db3VudCgpO1xuICAgIGxldCByZXN1bHRzID0ge307XG4gICAgZm9yIChsZXQgaT0wO2k8Y291bnQ7aSsrKSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBjdXJzb3IuZ2V0VHlwZShpKTtcbiAgICAgICAgLy9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cbiAgICAgICAgY29uc3QgbmFtZSA9IGN1cnNvci5nZXRDb2x1bW5OYW1lKGkpO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgMDogLy8gTlVMTFxuICAgICAgICAgICAgICAgIHJlc3VsdHNbbmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDE6IC8vIEludGVnZXJcbiAgICAgICAgICAgICAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgICAgICAgICAgICAgIHJlc3VsdHNbbmFtZV0gPSBjdXJzb3IuZ2V0TG9uZyhpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAyOiAvLyBGbG9hdFxuICAgICAgICAgICAgICAgIC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgcmVzdWx0c1tuYW1lXSA9IGN1cnNvci5nZXRGbG9hdChpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAzOiAvLyBTdHJpbmdcbiAgICAgICAgICAgICAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgICAgICAgICAgICAgIHJlc3VsdHNbbmFtZV0gPSBjdXJzb3IuZ2V0U3RyaW5nKGkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDQ6IC8vIEJsb2JcbiAgICAgICAgICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNDaGVja0Z1bmN0aW9uU2lnbmF0dXJlc1xuICAgICAgICAgICAgICAgIHJlc3VsdHNbbmFtZV0gPSBjdXJzb3IuZ2V0QmxvYihpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NRTElURSAtIFVua25vd24gRmllbGQgVHlwZSAnKyB0eXBlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbn1cblxuLyoqKlxuICogUGFyc2VzIGEgUm93IG9mIGRhdGEgaW50byBhIEpTIE9iamVjdCAoYXMgU3RyaW5nKVxuICogQHBhcmFtIGN1cnNvclxuICogQHJldHVybnMge3t9fVxuICovXG5mdW5jdGlvbiBEQkdldFJvd09iamVjdFN0cmluZyhjdXJzb3IpIHtcbiAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgIGNvbnN0IGNvdW50ID0gY3Vyc29yLmdldENvbHVtbkNvdW50KCk7XG4gICAgbGV0IHJlc3VsdHMgPSB7fTtcbiAgICBmb3IgKGxldCBpPTA7aTxjb3VudDtpKyspIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IGN1cnNvci5nZXRUeXBlKGkpO1xuICAgICAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgICAgICBjb25zdCBuYW1lID0gY3Vyc29yLmdldENvbHVtbk5hbWUoaSk7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSAwOiAvLyBOVUxMXG4gICAgICAgICAgICAgICAgcmVzdWx0c1tuYW1lXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMTogLy8gSW50ZWdlclxuICAgICAgICAgICAgICAgIC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgcmVzdWx0c1tuYW1lXSA9IGN1cnNvci5nZXRTdHJpbmcoaSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMjogLy8gRmxvYXRcbiAgICAgICAgICAgICAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgICAgICAgICAgICAgIHJlc3VsdHNbbmFtZV0gPSBjdXJzb3IuZ2V0U3RyaW5nKGkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDM6IC8vIFN0cmluZ1xuICAgICAgICAgICAgICAgIC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgcmVzdWx0c1tuYW1lXSA9IGN1cnNvci5nZXRTdHJpbmcoaSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgNDogLy8gQmxvYlxuICAgICAgICAgICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU0NoZWNrRnVuY3Rpb25TaWduYXR1cmVzXG4gICAgICAgICAgICAgICAgcmVzdWx0c1tuYW1lXSA9IGN1cnNvci5nZXRCbG9iKGkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU1FMSVRFIC0gVW5rbm93biBGaWVsZCBUeXBlICcrIHR5cGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xufVxuXG4vLyBEZWZhdWx0IFJlc3VsdHNldCBlbmdpbmVcbmxldCBEQkdldFJvd1Jlc3VsdHMgPSBEQkdldFJvd0FycmF5TmF0aXZlO1xuXG5mdW5jdGlvbiBzZXRSZXN1bHRWYWx1ZVR5cGVFbmdpbmUocmVzdWx0VHlwZSwgdmFsdWVUeXBlKSB7XG4gICAgaWYgKHJlc3VsdFR5cGUgPT09IERhdGFiYXNlLlJFU1VMVFNBU09CSkVDVCkge1xuICAgICAgICBpZiAodmFsdWVUeXBlID09PSBEYXRhYmFzZS5WQUxVRVNBUkVOQVRJVkUpIHtcbiAgICAgICAgICAgIERCR2V0Um93UmVzdWx0cyA9IERCR2V0Um93T2JqZWN0TmF0aXZlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgREJHZXRSb3dSZXN1bHRzID0gREJHZXRSb3dPYmplY3RTdHJpbmc7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyBSRVNVTFRTQVNBUlJBWVxuICAgICAgICBpZiAodmFsdWVUeXBlID09PSBEYXRhYmFzZS5WQUxVRVNBUkVOQVRJVkUpIHtcbiAgICAgICAgICAgIERCR2V0Um93UmVzdWx0cyA9IERCR2V0Um93QXJyYXlOYXRpdmU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBEQkdldFJvd1Jlc3VsdHMgPSBEQkdldFJvd0FycmF5U3RyaW5nO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKioqXG4gKiBEYXRhYmFzZSBDb25zdHJ1Y3RvclxuICogQHBhcmFtIGRibmFtZSAtIERhdGFiYXNlIE5hbWVcbiAqIEBwYXJhbSBjYWxsYmFjayAtIENhbGxiYWNrIHdoZW4gRG9uZVxuICogQHBhcmFtIG9wdGlvbnNcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBvYmplY3RcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBEYXRhYmFzZShkYm5hbWUsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG5cdGlmICghdGhpcyBpbnN0YW5jZW9mIERhdGFiYXNlKSB7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuXHRcdC8vbm9pbnNwZWN0aW9uIEpTVmFsaWRhdGVUeXBlc1xuXHRcdHJldHVybiBuZXcgRGF0YWJhc2UoZGJuYW1lLCBvcHRpb25zLCBjYWxsYmFjayk7XG5cdH1cblx0dGhpcy5faXNPcGVuID0gZmFsc2U7XG5cdHRoaXMuX3Jlc3VsdFR5cGUgPSBEYXRhYmFzZS5SRVNVTFRTQVNBUlJBWTtcblx0dGhpcy5fdmFsdWVzVHlwZSA9IERhdGFiYXNlLlZBTFVFU0FSRU5BVElWRTtcblxuXG5cdGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdGNhbGxiYWNrID0gb3B0aW9ucztcblx0XHQvL25vaW5zcGVjdGlvbiBKU1VudXNlZEFzc2lnbm1lbnRcblx0XHRvcHRpb25zID0ge307XG5cdH0gZWxzZSB7XG5cdFx0Ly9ub2luc3BlY3Rpb24gSlNVbnVzZWRBc3NpZ25tZW50XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdH1cblxuICAgIC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFZhcmlhYmxlXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5tdWx0aXRocmVhZGluZyAmJiB0eXBlb2YgZ2xvYmFsLldvcmtlciA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICAgLy8gV2UgZG9uJ3Qgd2FudCB0aGlzIHBhc3NlZCBpbnRvIHRoZSB3b3JrZXI7IHRvIHRyeSBhbmQgc3RhcnQgYW5vdGhlciB3b3JrZXIgKHdoaWNoIHdvdWxkIGZhaWwpLlxuXHQgICAgICAgIGRlbGV0ZSBvcHRpb25zLm11bHRpdGhyZWFkaW5nO1xuXHQgICAgICAgIGlmICghRGF0YWJhc2UuSEFTX0NPTU1FUkNJQUwpIHtcblx0ICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29tbWVyY2lhbCBvbmx5IGZlYXR1cmU7IHNlZSBodHRwOi8vbmF0aXZlc2NyaXB0LnRvb2xzL3Byb2R1Y3QvMTBcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGFiYXNlLl9tdWx0aVNRTChkYm5hbWUsIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICB9XG5cblxuXHQvLyBDaGVjayB0byBzZWUgaWYgaXQgaGFzIGEgcGF0aCwgb3IgaWYgaXQgaXMgYSByZWxhdGl2ZSBkYm5hbWVcblx0Ly8gZGJuYW1lID0gXCJcIiAtIFRlbXBvcmFyeSBEYXRhYmFzZVxuXHQvLyBkYm5hbWUgPSBcIjptZW1vcnk6XCIgPSBtZW1vcnkgZGF0YWJhc2Vcblx0aWYgKGRibmFtZSAhPT0gXCJcIiAmJiBkYm5hbWUgIT09IFwiOm1lbW9yeTpcIikge1xuXHRcdC8vdmFyIHBrZ05hbWUgPSBhcHBNb2R1bGUuYW5kcm9pZC5jb250ZXh0LmdldFBhY2thZ2VOYW1lKCk7XG5cdFx0Ly9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cblx0XHRkYm5hbWUgPSBfZ2V0Q29udGV4dCgpLmdldERhdGFiYXNlUGF0aChkYm5hbWUpLmdldEFic29sdXRlUGF0aCgpLnRvU3RyaW5nKCk7XG5cdFx0bGV0IHBhdGggPSBkYm5hbWUuc3Vic3RyKDAsIGRibmFtZS5sYXN0SW5kZXhPZignLycpICsgMSk7XG5cblx0XHQvLyBDcmVhdGUgXCJkYXRhYmFzZXNcIiBmb2xkZXIgaWYgaXQgaXMgbWlzc2luZy4gIFRoaXMgY2F1c2VzIGlzc3VlcyBvbiBFbXVsYXRvcnMgaWYgaXQgaXMgbWlzc2luZ1xuXHRcdC8vIFNvIHdlIGNyZWF0ZSBpdCBpZiBpdCBpcyBtaXNzaW5nXG5cblx0XHR0cnkge1xuICAgICAgICAgICAgLy9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb24sSlNVbnJlc29sdmVkVmFyaWFibGVcbiAgICAgICAgICAgIGxldCBqYXZhRmlsZSA9IG5ldyBqYXZhLmlvLkZpbGUocGF0aCk7XG5cdFx0XHRpZiAoIWphdmFGaWxlLmV4aXN0cygpKSB7XG5cdFx0XHRcdC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG5cdFx0XHRcdGphdmFGaWxlLm1rZGlycygpO1xuXHRcdFx0XHQvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuXHRcdFx0XHRqYXZhRmlsZS5zZXRSZWFkYWJsZSh0cnVlKTtcblx0XHRcdFx0Ly9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cblx0XHRcdFx0amF2YUZpbGUuc2V0V3JpdGFibGUodHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNhdGNoIChlcnIpIHtcblx0XHRcdGNvbnNvbGUuaW5mbyhcIlNRTElURS5DT05TVFJVQ1RPUiAtIENyZWF0aW5nIERCIEZvbGRlciBFcnJvclwiLCBlcnIpO1xuXHRcdH1cblx0fVxuXHRjb25zdCBzZWxmID0gdGhpcztcblxuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdHRyeSB7XG5cdFx0XHRsZXQgZmxhZ3MgPSAwO1xuXHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zLmFuZHJvaWRGbGFncyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0ZmxhZ3MgPSBvcHRpb25zLmFuZHJvaWRGbGFncztcblx0XHRcdH1cblx0XHRcdHNlbGYuX2RiID0gc2VsZi5fb3BlbkRhdGFiYXNlKGRibmFtZSwgZmxhZ3MsIG9wdGlvbnMsIF9nZXRDb250ZXh0KCkpO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihcIlNRTElURS5DT05TVFJVQ1RPUiAtICBPcGVuIERCIEVycm9yXCIsIGVycik7XG5cdFx0XHRpZiAoY2FsbGJhY2spIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyLCBudWxsKTtcblx0XHRcdH1cblx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHNlbGYuX2lzT3BlbiA9IHRydWU7XG5cblx0XHRsZXQgZG9uZUNudCA9IF9EYXRhYmFzZVBsdWdpbkluaXRzLmxlbmd0aCwgZG9uZUhhbmRsZWQgPSAwO1xuXHRcdGNvbnN0IGRvbmUgPSBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdGRvbmVIYW5kbGVkID0gZG9uZUNudDsgIC8vIFdlIGRvbid0IHdhbnQgYW55IG1vcmUgdHJpZ2dlcnMgYWZ0ZXIgdGhpc1xuXHRcdFx0XHRpZiAoY2FsbGJhY2spIHtcblx0XHRcdFx0XHRjYWxsYmFjayhlcnIsIG51bGwpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRkb25lSGFuZGxlZCsrO1xuXHRcdFx0aWYgKGRvbmVIYW5kbGVkID09PSBkb25lQ250KSB7XG5cdFx0XHRcdGlmIChjYWxsYmFjaykge1xuXHRcdFx0XHRcdGNhbGxiYWNrKG51bGwsIHNlbGYpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlc29sdmUoc2VsZik7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGlmIChkb25lQ250KSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRvbmVDbnQ7IGkrKykge1xuXHRcdFx0XHRcdF9EYXRhYmFzZVBsdWdpbkluaXRzW2ldLmNhbGwoc2VsZiwgb3B0aW9ucywgZG9uZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNhdGNoIChlcnIpIHtcblx0XHRcdFx0ZG9uZShlcnIpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoY2FsbGJhY2spIHtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgc2VsZik7XG5cdFx0XHR9XG5cdFx0XHRyZXNvbHZlKHNlbGYpO1xuXHRcdH1cblxuXHR9KTtcbn1cblxuLyoqXG4gKiBGdW5jdGlvbiB0byBoYW5kbGUgb3BlbmluZyBEYXRhYmFzZVxuICogQHBhcmFtIGRiTmFtZVxuICogQHBhcmFtIGZsYWdzXG4gKiBAcHJpdmF0ZVxuICovXG5EYXRhYmFzZS5wcm90b3R5cGUuX29wZW5EYXRhYmFzZSA9IGZ1bmN0aW9uKGRiTmFtZSwgZmxhZ3MpIHtcblx0aWYgKGRiTmFtZSA9PT0gXCI6bWVtb3J5OlwiKSB7XG5cdFx0Ly9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkVmFyaWFibGVcblx0XHRyZXR1cm4gYW5kcm9pZC5kYXRhYmFzZS5zcWxpdGUuU1FMaXRlRGF0YWJhc2UuY3JlYXRlKGZsYWdzKTtcblx0fSBlbHNlIHtcblx0XHQvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRWYXJpYWJsZSxKU1VucmVzb2x2ZWRGdW5jdGlvblxuXHRcdHJldHVybiBhbmRyb2lkLmRhdGFiYXNlLnNxbGl0ZS5TUUxpdGVEYXRhYmFzZS5vcGVuRGF0YWJhc2UoZGJOYW1lLCBudWxsLCBmbGFncyB8IDB4MTAwMDAwMDApO1xuXHR9XG59O1xuXG4vKioqXG4gKiBDb25zdGFudCB0aGF0IHRoaXMgc3RydWN0dXJlIGlzIGEgc3FsaXRlIHN0cnVjdHVyZVxuICogQHR5cGUge2Jvb2xlYW59XG4gKi9cbkRhdGFiYXNlLnByb3RvdHlwZS5faXNTcWxpdGUgPSB0cnVlO1xuXG4vKioqXG4gKiBUaGlzIGdldHMgb3Igc2V0cyB0aGUgZGF0YWJhc2UgdmVyc2lvblxuICogQHBhcmFtIHZhbHVlT3JDYWxsYmFjayB0byBzZXQgb3IgY2FsbGJhY2soZXJyLCB2ZXJzaW9uKVxuICogQHJldHVybnMgUHJvbWlzZVxuICovXG5EYXRhYmFzZS5wcm90b3R5cGUudmVyc2lvbiA9IGZ1bmN0aW9uKHZhbHVlT3JDYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2YgdmFsdWVPckNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgnUFJBR01BIHVzZXJfdmVyc2lvbicsIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIHZhbHVlT3JDYWxsYmFjayhlcnIsIGRhdGEgJiYgcGFyc2VJbnQoZGF0YVswXSwxMCkpO1xuICAgICAgICB9LCBEYXRhYmFzZS5SRVNVTFRTQVNBUlJBWSk7XG4gICAgfSBlbHNlIGlmICghaXNOYU4odmFsdWVPckNhbGxiYWNrKzApKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4ZWNTUUwoJ1BSQUdNQSB1c2VyX3ZlcnNpb249JysodmFsdWVPckNhbGxiYWNrKzApLnRvU3RyaW5nKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgnUFJBR01BIHVzZXJfdmVyc2lvbicsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBEYXRhYmFzZS5SRVNVTFRTQVNBUlJBWSk7XG4gICAgfVxufTtcblxuLyoqKlxuICogSXMgdGhlIGRhdGFiYXNlIGN1cnJlbnRseSBvcGVuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIHRoZSBkYiBpcyBvcGVuXG4gKi9cbkRhdGFiYXNlLnByb3RvdHlwZS5pc09wZW4gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5faXNPcGVuO1xufTtcblxuLyoqKlxuICogR2V0cy9TZXRzIHdoZXRoZXIgeW91IGdldCBBcnJheXMgb3IgT2JqZWN0cyBmb3IgdGhlIHJvdyB2YWx1ZXNcbiAqIEBwYXJhbSB2YWx1ZSAtIERhdGFiYXNlLlJFU1VMVFNBU0FSUkFZIG9yIERhdGFiYXNlLlJFU1VMVFNBU09CSkVDVFxuICogQHJldHVybnMge251bWJlcn0gLSBEYXRhYmFzZS5SRVNVTFRTQVNBUlJBWSBvciBEYXRhYmFzZS5SRVNVTFRTQVNPQkpFQ1RcbiAqL1xuRGF0YWJhc2UucHJvdG90eXBlLnJlc3VsdFR5cGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gRGF0YWJhc2UuUkVTVUxUU0FTQVJSQVkpIHtcbiAgICAgICAgdGhpcy5fcmVzdWx0VHlwZSA9IERhdGFiYXNlLlJFU1VMVFNBU0FSUkFZO1xuICAgICAgICBzZXRSZXN1bHRWYWx1ZVR5cGVFbmdpbmUodGhpcy5fcmVzdWx0VHlwZSwgdGhpcy5fdmFsdWVzVHlwZSk7XG5cbiAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBEYXRhYmFzZS5SRVNVTFRTQVNPQkpFQ1QpIHtcbiAgICAgICAgdGhpcy5fcmVzdWx0VHlwZSA9IERhdGFiYXNlLlJFU1VMVFNBU09CSkVDVDtcbiAgICAgICAgc2V0UmVzdWx0VmFsdWVUeXBlRW5naW5lKHRoaXMuX3Jlc3VsdFR5cGUsIHRoaXMuX3ZhbHVlc1R5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcmVzdWx0VHlwZTtcbn07XG5cbi8qKipcbiAqIEdldHMvU2V0cyB3aGV0aGVyIHlvdSBnZXQgTmF0aXZlIG9yIFN0cmluZ3MgZm9yIHRoZSByb3cgdmFsdWVzXG4gKiBAcGFyYW0gdmFsdWUgLSBEYXRhYmFzZS5WQUxVRVNBUkVOQVRJVkUgb3IgRGF0YWJhc2UuVkFMVUVTQVJFU1RSSU5HU1xuICogQHJldHVybnMge251bWJlcn0gLSBEYXRhYmFzZS5WQUxVRVNBUkVOQVRJVkUgb3IgRGF0YWJhc2UuVkFMVUVTQVJFU1RSSU5HU1xuICovXG5EYXRhYmFzZS5wcm90b3R5cGUudmFsdWVUeXBlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09IERhdGFiYXNlLlZBTFVFU0FSRU5BVElWRSkge1xuICAgICAgICB0aGlzLl92YWx1ZXNUeXBlID0gRGF0YWJhc2UuVkFMVUVTQVJFTkFUSVZFO1xuICAgICAgICBzZXRSZXN1bHRWYWx1ZVR5cGVFbmdpbmUodGhpcy5fcmVzdWx0VHlwZSwgdGhpcy5fdmFsdWVzVHlwZSk7XG5cbiAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBEYXRhYmFzZS5WQUxVRVNBUkVTVFJJTkdTKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlc1R5cGUgPSBEYXRhYmFzZS5WQUxVRVNBUkVTVFJJTkdTO1xuICAgICAgICBzZXRSZXN1bHRWYWx1ZVR5cGVFbmdpbmUodGhpcy5fcmVzdWx0VHlwZSwgdGhpcy5fdmFsdWVzVHlwZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl92YWx1ZXNUeXBlO1xufTtcblxuLy8gbm9pbnNwZWN0aW9uIEpTVW51c2VkTG9jYWxTeW1ib2xzXG4vKipcbiAqIER1bW15IHRyYW5zYWN0aW9uIGZ1bmN0aW9uIGZvciBwdWJsaWMgdmVyc2lvblxuICogQHBhcmFtIGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAqL1xuRGF0YWJhc2UucHJvdG90eXBlLmJlZ2luID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdGhyb3cgbmV3IEVycm9yKFwiVHJhbnNhY3Rpb25zIGFyZSBhIENvbW1lcmNpYWwgdmVyc2lvbiBmZWF0dXJlLlwiKTtcbn07XG5cbi8vIG5vaW5zcGVjdGlvbiBKU1VudXNlZExvY2FsU3ltYm9sc1xuLyoqXG4gKiBEdW1teSBwcmVwYXJlIGZ1bmN0aW9uIGZvciBwdWJsaWMgdmVyc2lvblxuICogQHBhcmFtIHNxbFxuICogQHJldHVybnMgeyp9XG4gKi9cbkRhdGFiYXNlLnByb3RvdHlwZS5wcmVwYXJlID0gZnVuY3Rpb24oc3FsKSB7XG5cdHRocm93IG5ldyBFcnJvcihcIlByZXBhcmVkIHN0YXRlbWVudHMgYXJlIGEgQ29tbWVyY2lhbCB2ZXJzaW9uIGZlYXR1cmUuXCIpO1xufTtcblxuXG5cblxuLyoqKlxuICogQ2xvc2VzIHRoaXMgZGF0YWJhc2UsIGFueSBxdWVyaWVzIGFmdGVyIHRoaXMgd2lsbCBmYWlsIHdpdGggYW4gZXJyb3JcbiAqIEBwYXJhbSBjYWxsYmFja1xuICovXG5EYXRhYmFzZS5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBpZiAoIXNlbGYuX2lzT3Blbikge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soJ1NRTElURS5DTE9TRSAtIERhdGFiYXNlIGlzIGFscmVhZHkgY2xvc2VkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWplY3QoJ1NRTElURS5DTE9TRSAtIERhdGFiYXNlIGlzIGFscmVhZHkgY2xvc2VkJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLl9kYi5jbG9zZSgpO1xuICAgICAgICBzZWxmLl9pc09wZW4gPSBmYWxzZTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKCk7XG4gICAgfSk7XG59O1xuXG4vKioqXG4gKiBFeGVjIFNRTFxuICogQHBhcmFtIHNxbCAtIHNxbCB0byB1c2VcbiAqIEBwYXJhbSBwYXJhbXMgLSBvcHRpb25hbCBhcnJheSBvZiBwYXJhbWV0ZXJzXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSAoZXJyLCByZXN1bHQpIC0gY2FuIGJlIGxhc3Rfcm93X2lkIGZvciBpbnNlcnQsIGFuZCByb3dzIGFmZmVjdGVkIGZvciB1cGRhdGUvZGVsZXRlXG4gKiBAcmV0dXJucyBQcm9taXNlXG4gKi9cbkRhdGFiYXNlLnByb3RvdHlwZS5leGVjU1FMID0gZnVuY3Rpb24oc3FsLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBwYXJhbXM7XG4gICAgICAgIHBhcmFtcyA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGxldCBoYXNDYWxsYmFjayA9IHRydWU7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gcmVqZWN0O1xuICAgICAgICAgICAgaGFzQ2FsbGJhY2sgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2VsZi5faXNPcGVuKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhcIlNRTElURS5FWEVDU1FMIC0gRGF0YWJhc2UgaXMgbm90IG9wZW5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOZWVkIHRvIHNlZSBpZiB3ZSBoYXZlIHRvIHJ1biBhbnkgc3RhdHVzIHF1ZXJpZXMgYWZ0ZXJ3b3Jkc1xuICAgICAgICBsZXQgZmxhZ3MgPSAwO1xuICAgICAgICBsZXQgdGVzdCA9IHNxbC50cmltKCkuc3Vic3RyKDAsIDcpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmICh0ZXN0ID09PSAnaW5zZXJ0ICcpIHtcbiAgICAgICAgICAgIGZsYWdzID0gMTtcbiAgICAgICAgfSBlbHNlIGlmICh0ZXN0ID09PSAndXBkYXRlICcgfHwgdGVzdCA9PT0gJ2RlbGV0ZSAnKSB7XG4gICAgICAgICAgICBmbGFncyA9IDI7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHBhcmFtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fZGIuZXhlY1NRTChzcWwsIHNlbGYuX3RvU3RyaW5nQXJyYXkocGFyYW1zKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuX2RiLmV4ZWNTUUwoc3FsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoRXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhFcnIsIG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChmbGFncykge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIGlmIChoYXNDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNJZ25vcmVkUHJvbWlzZUZyb21DYWxsXG4gICAgICAgICAgICAgICAgc2VsZi5nZXQoJ3NlbGVjdCBsYXN0X2luc2VydF9yb3dpZCgpJywgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSAmJiBkYXRhWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSAmJiBkYXRhWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIERhdGFiYXNlLlJFU1VMVFNBU0FSUkFZIHwgRGF0YWJhc2UuVkFMVUVTQVJFTkFUSVZFKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNJZ25vcmVkUHJvbWlzZUZyb21DYWxsXG4gICAgICAgICAgICAgICAgc2VsZi5nZXQoJ3NlbGVjdCBjaGFuZ2VzKCknLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXNDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhICYmIGRhdGFbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhICYmIGRhdGFbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgRGF0YWJhc2UuUkVTVUxUU0FTQVJSQVkgfCBEYXRhYmFzZS5WQUxVRVNBUkVOQVRJVkUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgIH0pO1xufTtcblxuLyoqKlxuICogR2V0IHRoZSBmaXJzdCByZWNvcmQgcmVzdWx0IHNldFxuICogQHBhcmFtIHNxbCAtIHNxbCB0byBydW5cbiAqIEBwYXJhbSBwYXJhbXMgLSBvcHRpb25hbFxuICogQHBhcmFtIGNhbGxiYWNrIC0gY2FsbGJhY2sgKGVycm9yLCByZXN1bHRzKVxuICogQHBhcmFtIG1vZGUgLSBhbGxvd3MgeW91IHRvIG1hbnVhbGx5IG92ZXJyaWRlIHRoZSByZXN1bHRzIHNldCB0byBiZSBhIGFycmF5IG9yIG9iamVjdFxuICogQHJldHVybnMgUHJvbWlzZVxuICovXG5EYXRhYmFzZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oc3FsLCBwYXJhbXMsIGNhbGxiYWNrLCBtb2RlKSB7XG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbW9kZSA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjayA9IHBhcmFtcztcbiAgICAgICAgcGFyYW1zID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgbGV0IGhhc0NhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSByZWplY3Q7XG4gICAgICAgICAgICBoYXNDYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZWxmLl9pc09wZW4pIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKFwiU1FMSVRFLkdFVCAtIERhdGFiYXNlIGlzIG5vdCBvcGVuXCIsIG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGN1cnNvcjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChwYXJhbXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgY3Vyc29yID0gc2VsZi5fZGIucmF3UXVlcnkoc3FsLCBzZWxmLl90b1N0cmluZ0FycmF5KHBhcmFtcykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgICAgICAgICAgICAgIGN1cnNvciA9IHNlbGYuX2RiLnJhd1F1ZXJ5KHNxbCwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vIFJlY29yZHNcbiAgICAgICAgLy8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgIGlmIChjdXJzb3IuZ2V0Q291bnQoKSA9PT0gMCkge1xuICAgICAgICAgICAgY3Vyc29yLmNsb3NlKCk7XG4gICAgICAgICAgICBpZiAoaGFzQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVzdWx0cztcbiAgICAgICAgY29uc3QgcmVzdWx0RW5naW5lID0gc2VsZi5fZ2V0UmVzdWx0RW5naW5lKG1vZGUpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cbiAgICAgICAgICAgIGN1cnNvci5tb3ZlVG9GaXJzdCgpO1xuICAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdEVuZ2luZShjdXJzb3IpO1xuICAgICAgICAgICAgY3Vyc29yLmNsb3NlKCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFzQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUocmVzdWx0cyk7XG4gICAgfSk7XG59O1xuXG5EYXRhYmFzZS5wcm90b3R5cGUuX2dldFJlc3VsdEVuZ2luZSA9IGZ1bmN0aW9uKG1vZGUpIHtcbiAgICBpZiAobW9kZSA9PSBudWxsIHx8IG1vZGUgPT09IDApIHJldHVybiBEQkdldFJvd1Jlc3VsdHM7XG5cbiAgICBsZXQgcmVzdWx0VHlwZSA9IChtb2RlICYgRGF0YWJhc2UuUkVTVUxUU0FTQVJSQVl8RGF0YWJhc2UuUkVTVUxUU0FTT0JKRUNUKTtcbiAgICBpZiAocmVzdWx0VHlwZSA9PT0gMCkge1xuICAgICAgICByZXN1bHRUeXBlID0gdGhpcy5fcmVzdWx0VHlwZTtcbiAgICB9XG4gICAgbGV0IHZhbHVlVHlwZSA9IChtb2RlICYgRGF0YWJhc2UuVkFMVUVTQVJFTkFUSVZFfERhdGFiYXNlLlZBTFVFU0FSRVNUUklOR1MpO1xuICAgIGlmICh2YWx1ZVR5cGUgPT09IDApIHtcbiAgICAgICAgdmFsdWVUeXBlID0gdGhpcy5fdmFsdWVzVHlwZTtcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0VHlwZSA9PT0gRGF0YWJhc2UuUkVTVUxUU0FTT0JKRUNUKSB7XG4gICAgICAgIGlmICh2YWx1ZVR5cGUgPT09IERhdGFiYXNlLlZBTFVFU0FSRVNUUklOR1MpIHtcbiAgICAgICAgICAgIHJldHVybiBEQkdldFJvd09iamVjdFN0cmluZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBEQkdldFJvd09iamVjdE5hdGl2ZTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh2YWx1ZVR5cGUgPT09IERhdGFiYXNlLlZBTFVFU0FSRVNUUklOR1MpIHtcbiAgICAgICAgICAgIHJldHVybiBEQkdldFJvd0FycmF5U3RyaW5nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIERCR2V0Um93QXJyYXlOYXRpdmU7XG4gICAgICAgIH1cbiAgICB9XG5cbn07XG5cbi8qKipcbiAqIFRoaXMgcmV0dXJucyB0aGUgZW50aXJlIHJlc3VsdCBzZXQgaW4gYSBhcnJheSBvZiByb3dzXG4gKiBAcGFyYW0gc3FsIC0gU3FsIHRvIHJ1blxuICogQHBhcmFtIHBhcmFtcyAtIG9wdGlvbmFsXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSAoZXJyLCByZXN1bHRzKVxuICogQHJldHVybnMgUHJvbWlzZVxuICovXG5EYXRhYmFzZS5wcm90b3R5cGUuYWxsID0gZnVuY3Rpb24oc3FsLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBwYXJhbXM7XG4gICAgICAgIHBhcmFtcyA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGxldCBoYXNDYWxsYmFjayA9IHRydWU7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gcmVqZWN0O1xuICAgICAgICAgICAgaGFzQ2FsbGJhY2sgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2VsZi5faXNPcGVuKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhcIlNRTElURS5BTEwgLSBEYXRhYmFzZSBpcyBub3Qgb3BlblwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjdXJzb3IsIGNvdW50O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHBhcmFtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgLy9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cbiAgICAgICAgICAgICAgICBjdXJzb3IgPSBzZWxmLl9kYi5yYXdRdWVyeShzcWwsIHNlbGYuX3RvU3RyaW5nQXJyYXkocGFyYW1zKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgY3Vyc29yID0gc2VsZi5fZGIucmF3UXVlcnkoc3FsLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgICAgICAgICAgY291bnQgPSBjdXJzb3IuZ2V0Q291bnQoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyBObyBSZWNvcmRzXG4gICAgICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgY3Vyc29yLmNsb3NlKCk7XG4gICAgICAgICAgICBpZiAoaGFzQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBbXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXNvbHZlKFtdKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgICAgICBjdXJzb3IubW92ZVRvRmlyc3QoKTtcblxuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IERCR2V0Um93UmVzdWx0cyhjdXJzb3IpOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICAgLy9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cbiAgICAgICAgICAgICAgICBjdXJzb3IubW92ZVRvTmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3Vyc29yLmNsb3NlKCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFzQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUocmVzdWx0cyk7XG4gICAgfSk7XG59O1xuXG4vKioqXG4gKiBUaGlzIHNlbmRzIGVhY2ggcm93IG9mIHRoZSByZXN1bHQgc2V0IHRvIHRoZSBcIkNhbGxiYWNrXCIgYW5kIGF0IHRoZSBlbmQgY2FsbHMgdGhlIGNvbXBsZXRlIGNhbGxiYWNrIHVwb24gY29tcGxldGlvblxuICogQHBhcmFtIHNxbCAtIHNxbCB0byBydW5cbiAqIEBwYXJhbSBwYXJhbXMgLSBvcHRpb25hbFxuICogQHBhcmFtIGNhbGxiYWNrIC0gY2FsbGJhY2sgKGVyciwgcm93c1Jlc3VsdClcbiAqIEBwYXJhbSBjb21wbGV0ZSAtIGNhbGxiYWNrIChlcnIsIHJlY29yZENvdW50KVxuICogQHJldHVybnMgUHJvbWlzZVxuICovXG5EYXRhYmFzZS5wcm90b3R5cGUuZWFjaCA9IGZ1bmN0aW9uKHNxbCwgcGFyYW1zLCBjYWxsYmFjaywgY29tcGxldGUpIHtcbiAgICBpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb21wbGV0ZSA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjayA9IHBhcmFtcztcbiAgICAgICAgcGFyYW1zID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIENhbGxiYWNrIGlzIHJlcXVpcmVkXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTUUxJVEUuRUFDSCAtIHJlcXVpcmVzIGEgY2FsbGJhY2tcIik7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgICAvLyBTZXQgdGhlIGVycm9yIENhbGxiYWNrXG4gICAgICAgIGxldCBlcnJvckNCID0gY29tcGxldGUgfHwgY2FsbGJhY2s7XG5cbiAgICAgICAgbGV0IGN1cnNvciwgY291bnQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAocGFyYW1zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgICAgICAgICAgICAgIGN1cnNvciA9IHNlbGYuX2RiLnJhd1F1ZXJ5KHNxbCwgc2VsZi5fdG9TdHJpbmdBcnJheShwYXJhbXMpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cbiAgICAgICAgICAgICAgICBjdXJzb3IgPSBzZWxmLl9kYi5yYXdRdWVyeShzcWwsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgICAgICBjb3VudCA9IGN1cnNvci5nZXRDb3VudCgpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGVycm9yQ0IoZXJyLCBudWxsKTtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm8gUmVjb3Jkc1xuICAgICAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgICAgICAgIGN1cnNvci5jbG9zZSgpO1xuICAgICAgICAgICAgaWYgKGNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgY29tcGxldGUobnVsbCwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXNvbHZlKDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgIGN1cnNvci5tb3ZlVG9GaXJzdCgpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gREJHZXRSb3dSZXN1bHRzKGN1cnNvcik7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGRhdGEpO1xuICAgICAgICAgICAgICAgIC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgY3Vyc29yLm1vdmVUb05leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnNvci5jbG9zZSgpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGVycm9yQ0IoZXJyLCBudWxsKTtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb21wbGV0ZSkge1xuICAgICAgICAgICAgY29tcGxldGUobnVsbCwgY291bnQpO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoY291bnQpO1xuICAgIH0pO1xufTtcblxuLyoqKlxuICogQ29udmVydHMgYSBNaXhlZCBBcnJheSB0byBhIFN0cmluZyBBcnJheVxuICogQHBhcmFtIHBhcmFtc1xuICogQHJldHVybnMge0FycmF5fVxuICogQHByaXZhdGVcbiAqL1xuRGF0YWJhc2UucHJvdG90eXBlLl90b1N0cmluZ0FycmF5ID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgbGV0IHN0cmluZ1BhcmFtcyA9IFtdO1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KHBhcmFtcykgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgY29uc3QgY291bnQgPSBwYXJhbXMubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8Y291bnQ7ICsraSkge1xuICAgICAgICAgICAgaWYgKHBhcmFtc1tpXSA9PSBudWxsKSB7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgICAgICAgICAgIHN0cmluZ1BhcmFtcy5wdXNoKG51bGwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHJpbmdQYXJhbXMucHVzaChwYXJhbXNbaV0udG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocGFyYW1zID09IG51bGwpIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgICAgICBzdHJpbmdQYXJhbXMucHVzaChudWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0cmluZ1BhcmFtcy5wdXNoKHBhcmFtcy50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyaW5nUGFyYW1zO1xufTtcblxuLyoqKlxuICogSXMgdGhpcyBhIFNRTGl0ZSBvYmplY3RcbiAqIEBwYXJhbSBvYmogLSBwb3NzaWJsZSBzcWxpdGUgb2JqZWN0IHRvIGNoZWNrXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRGF0YWJhc2UuaXNTcWxpdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIG9iai5faXNTcWxpdGU7XG59O1xuXG4vKipcbiAqIERvZXMgdGhpcyBkYXRhYmFzZSBleGlzdCBvbiBkaXNrXG4gKiBAcGFyYW0gbmFtZVxuICogQHJldHVybnMgeyp9XG4gKi9cbkRhdGFiYXNlLmV4aXN0cyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgIGNvbnN0IGRiTmFtZSA9IF9nZXRDb250ZXh0KCkuZ2V0RGF0YWJhc2VQYXRoKG5hbWUpLmdldEFic29sdXRlUGF0aCgpO1xuICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvbixKU1VucmVzb2x2ZWRWYXJpYWJsZVxuICAgIGNvbnN0IGRiRmlsZSA9IG5ldyBqYXZhLmlvLkZpbGUoZGJOYW1lKTtcbiAgICAvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cbiAgICByZXR1cm4gZGJGaWxlLmV4aXN0cygpO1xufTtcblxuLyoqXG4gKiBEZWxldGUgdGhlIGRhdGFiYXNlIGZpbGUgaWYgaXQgZXhpc3RzXG4gKiBAcGFyYW0gbmFtZVxuICovXG5EYXRhYmFzZS5kZWxldGVEYXRhYmFzZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgIGNvbnN0IGRiTmFtZSA9IF9nZXRDb250ZXh0KCkuZ2V0RGF0YWJhc2VQYXRoKG5hbWUpLmdldEFic29sdXRlUGF0aCgpO1xuICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvbixKU1VucmVzb2x2ZWRWYXJpYWJsZVxuICAgIGxldCBkYkZpbGUgPSBuZXcgamF2YS5pby5GaWxlKGRiTmFtZSk7XG4gICAgaWYgKGRiRmlsZS5leGlzdHMoKSkge1xuICAgICAgICBkYkZpbGUuZGVsZXRlKCk7XG4gICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvbixKU1VucmVzb2x2ZWRWYXJpYWJsZVxuICAgICAgICBkYkZpbGUgPSBuZXcgamF2YS5pby5GaWxlKGRiTmFtZSArICctam91cm5hbCcpO1xuICAgICAgICBpZiAoZGJGaWxlLmV4aXN0cygpKSB7XG4gICAgICAgICAgICBkYkZpbGUuZGVsZXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIENvcHkgdGhlIGRhdGFiYXNlIGZyb20gdGhlIGluc3RhbGwgbG9jYXRpb25cbiAqIEBwYXJhbSBuYW1lXG4gKi9cbkRhdGFiYXNlLmNvcHlEYXRhYmFzZSA9IGZ1bmN0aW9uKG5hbWUpIHtcblxuICAgIC8vT3BlbiB5b3VyIGxvY2FsIGRiIGFzIHRoZSBpbnB1dCBzdHJlYW1cbiAgICBsZXQgbXlJbnB1dDtcbiAgICB0cnkge1xuICAgICAgICAvLyBBdHRlbXB0IHRvIHVzZSB0aGUgbG9jYWwgYXBwIGRpcmVjdG9yeSB2ZXJzaW9uXG4gICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvbixKU1VucmVzb2x2ZWRWYXJpYWJsZVxuICAgICAgICBteUlucHV0ID0gbmV3IGphdmEuaW8uRmlsZUlucHV0U3RyZWFtKGZzTW9kdWxlLmtub3duRm9sZGVycy5jdXJyZW50QXBwKCkucGF0aCArICcvJyArIG5hbWUpO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIC8vIFVzZSB0aGUgQXNzZXRzIHZlcnNpb25cbiAgICAgICAgLy8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgIG15SW5wdXQgPSBfZ2V0Q29udGV4dCgpLmdldEFzc2V0cygpLm9wZW4oXCJhcHAvXCIrbmFtZSk7XG4gICAgfVxuXG4gICAgIFxuICAgIGlmIChuYW1lLmluZGV4T2YoJy8nKSkge1xuICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHJpbmcobmFtZS5sYXN0SW5kZXhPZignLycpKzEpO1xuICAgIH1cblxuICAgIC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgY29uc3QgZGJOYW1lID0gX2dldENvbnRleHQoKS5nZXREYXRhYmFzZVBhdGgobmFtZSkuZ2V0QWJzb2x1dGVQYXRoKCk7XG4gICAgY29uc3QgcGF0aCA9IGRiTmFtZS5zdWJzdHIoMCwgZGJOYW1lLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcblxuICAgIC8vIENyZWF0ZSBcImRhdGFiYXNlc1wiIGZvbGRlciBpZiBpdCBpcyBtaXNzaW5nLiAgVGhpcyBjYXVzZXMgaXNzdWVzIG9uIEVtdWxhdG9ycyBpZiBpdCBpcyBtaXNzaW5nXG4gICAgLy8gU28gd2UgY3JlYXRlIGl0IGlmIGl0IGlzIG1pc3NpbmdcblxuICAgIHRyeSB7XG4gICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvbixKU1VucmVzb2x2ZWRWYXJpYWJsZVxuICAgICAgICBjb25zdCBqYXZhRmlsZSA9IG5ldyBqYXZhLmlvLkZpbGUocGF0aCk7XG4gICAgICAgIC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgIGlmICghamF2YUZpbGUuZXhpc3RzKCkpIHtcbiAgICAgICAgICAgIC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgICAgICBqYXZhRmlsZS5ta2RpcnMoKTtcbiAgICAgICAgICAgIC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgICAgICBqYXZhRmlsZS5zZXRSZWFkYWJsZSh0cnVlKTtcbiAgICAgICAgICAgIC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgICAgICBqYXZhRmlsZS5zZXRXcml0YWJsZSh0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIlNRTElURSAtIENPUFlEQVRBQkFTRSAtIENyZWF0aW5nIERCIEZvbGRlciBFcnJvclwiLCBlcnIpO1xuICAgIH1cblxuICAgIC8vT3BlbiB0aGUgZW1wdHkgZGIgYXMgdGhlIG91dHB1dCBzdHJlYW1cbiAgICAvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb24sSlNVbnJlc29sdmVkVmFyaWFibGVcbiAgICBjb25zdCBteU91dHB1dCA9IG5ldyBqYXZhLmlvLkZpbGVPdXRwdXRTdHJlYW0oZGJOYW1lKTtcblxuXG4gICAgbGV0IHN1Y2Nlc3MgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICAgIC8vdHJhbnNmZXIgYnl0ZXMgZnJvbSB0aGUgaW5wdXQgZmlsZSB0byB0aGUgb3V0cHV0IGZpbGVcbiAgICAgICAgLy9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb24sSlNVbnJlc29sdmVkVmFyaWFibGVcbiAgICAgICAgbGV0IGJ1ZmZlciA9IGphdmEubGFuZy5yZWZsZWN0LkFycmF5Lm5ld0luc3RhbmNlKGphdmEubGFuZy5CeXRlLmNsYXNzLmdldEZpZWxkKFwiVFlQRVwiKS5nZXQobnVsbCksIDEwMjQpO1xuICAgICAgICBsZXQgbGVuZ3RoO1xuICAgICAgICB3aGlsZSAoKGxlbmd0aCA9IG15SW5wdXQucmVhZChidWZmZXIpKSA+IDApIHtcbiAgICAgICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgICAgICAgICAgbXlPdXRwdXQud3JpdGUoYnVmZmVyLCAwLCBsZW5ndGgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgc3VjY2VzcyA9IGZhbHNlO1xuICAgIH1cblxuXG4gICAgLy9DbG9zZSB0aGUgc3RyZWFtc1xuICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgIG15T3V0cHV0LmZsdXNoKCk7XG4gICAgLy8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgbXlPdXRwdXQuY2xvc2UoKTtcbiAgICBteUlucHV0LmNsb3NlKCk7XG4gICAgcmV0dXJuIHN1Y2Nlc3M7XG59O1xuXG4vLyBMaXRlcmFsIERlZmluZXNcbkRhdGFiYXNlLlJFU1VMVFNBU0FSUkFZICA9IDE7XG5EYXRhYmFzZS5SRVNVTFRTQVNPQkpFQ1QgPSAyO1xuRGF0YWJhc2UuVkFMVUVTQVJFTkFUSVZFID0gNDtcbkRhdGFiYXNlLlZBTFVFU0FSRVNUUklOR1MgPSA4O1xuXG5UcnlMb2FkaW5nQ29tbWVyY2lhbFBsdWdpbigpO1xuVHJ5TG9hZGluZ0VuY3J5cHRpb25QbHVnaW4oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhYmFzZTtcblxuLyoqXG4gKiBnZXRzIHRoZSBjdXJyZW50IGFwcGxpY2F0aW9uIGNvbnRleHRcbiAqIEByZXR1cm5zIHsqfVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX2dldENvbnRleHQoKSB7XG4gICAgaWYgKGFwcE1vZHVsZS5hbmRyb2lkLmNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIChhcHBNb2R1bGUuYW5kcm9pZC5jb250ZXh0KTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBhcHBNb2R1bGUuZ2V0TmF0aXZlQXBwbGljYXRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbGV0IGN0eCA9IGFwcE1vZHVsZS5nZXROYXRpdmVBcHBsaWNhdGlvbigpO1xuICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4O1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvbixKU1VucmVzb2x2ZWRWYXJpYWJsZVxuICAgIGN0eCA9IGphdmEubGFuZy5DbGFzcy5mb3JOYW1lKFwiYW5kcm9pZC5hcHAuQXBwR2xvYmFsc1wiKS5nZXRNZXRob2QoXCJnZXRJbml0aWFsQXBwbGljYXRpb25cIiwgbnVsbCkuaW52b2tlKG51bGwsIG51bGwpO1xuICAgIGlmIChjdHgpIHJldHVybiBjdHg7XG5cbiAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvbixKU1VucmVzb2x2ZWRWYXJpYWJsZVxuICAgIGN0eCA9IGphdmEubGFuZy5DbGFzcy5mb3JOYW1lKFwiYW5kcm9pZC5hcHAuQWN0aXZpdHlUaHJlYWRcIikuZ2V0TWV0aG9kKFwiY3VycmVudEFwcGxpY2F0aW9uXCIsIG51bGwpLmludm9rZShudWxsLCBudWxsKTtcbiAgICBpZiAoY3R4KSByZXR1cm4gY3R4O1xuXG4gICAgcmV0dXJuIGN0eDtcbn1cblxuLyoqIFVzZXMgYSBTUUxpdGUgUGx1Z2luICoqL1xuZnVuY3Rpb24gVXNlUGx1Z2luKGxvYWRlZFNyYywgREJNb2R1bGUpIHtcblx0XHRpZiAobG9hZGVkU3JjLnByb3RvdHlwZXMpIHtcblx0XHRcdGZvciAobGV0IGtleSBpbiBsb2FkZWRTcmMucHJvdG90eXBlcykge1xuXHRcdFx0ICAgIGlmICghbG9hZGVkU3JjLnByb3RvdHlwZXMuaGFzT3duUHJvcGVydHkoa2V5KSkgeyBjb250aW51ZTsgfVxuXHRcdFx0XHREQk1vZHVsZS5wcm90b3R5cGVba2V5XSA9IGxvYWRlZFNyYy5wcm90b3R5cGVzW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChsb2FkZWRTcmMuc3RhdGljcykge1xuXHRcdFx0Zm9yIChsZXQga2V5IGluIGxvYWRlZFNyYy5zdGF0aWNzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFsb2FkZWRTcmMuc3RhdGljcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgREJNb2R1bGVba2V5XSA9IGxvYWRlZFNyYy5zdGF0aWNzW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgbG9hZGVkU3JjLmluaXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdF9EYXRhYmFzZVBsdWdpbkluaXRzLnB1c2gobG9hZGVkU3JjLmluaXQpO1xuXHRcdH1cbn1cblxuZnVuY3Rpb24gVHJ5TG9hZGluZ0NvbW1lcmNpYWxQbHVnaW4oKSB7XG5cdHRyeSB7XG5cdFx0Y29uc3Qgc3FsQ29tID0gcmVxdWlyZSgnbmF0aXZlc2NyaXB0LXNxbGl0ZS1jb21tZXJjaWFsJyk7XG5cdFx0VXNlUGx1Z2luKHNxbENvbSwgRGF0YWJhc2UpO1xuXHR9XG5cdGNhdGNoIChlKSB7IC8qIERvIE5vdGhpbmcgaWYgaXQgZG9lc24ndCBleGlzdCBhcyBpdCBpcyBhbiBvcHRpb25hbCBwbHVnaW4gKi9cblx0fVxufVxuXG5mdW5jdGlvbiBUcnlMb2FkaW5nRW5jcnlwdGlvblBsdWdpbigpIHtcblx0dHJ5IHtcblx0XHRjb25zdCBzcWxFbmMgPSByZXF1aXJlKCduYXRpdmVzY3JpcHQtc3FsaXRlLWVuY3J5cHRlZCcpO1xuXHRcdFVzZVBsdWdpbihzcWxFbmMsIERhdGFiYXNlKTtcblx0fVxuXHRjYXRjaCAoZSkgeyAvKiBEbyBOb3RoaW5nIGlmIGl0IGRvZXNuJ3QgZXhpc3QgYXMgaXQgaXMgYW4gb3B0aW9uYWwgcGx1Z2luICovXG5cdH1cbn1cbjsgXG5pZiAobW9kdWxlLmhvdCAmJiBnbG9iYWwuX2lzTW9kdWxlTG9hZGVkRm9yVUkgJiYgZ2xvYmFsLl9pc01vZHVsZUxvYWRlZEZvclVJKFwiQzovZGV2ZWxvcC9NQVBmb3JQQUQvbm9kZV9tb2R1bGVzL25hdGl2ZXNjcmlwdC1zcWxpdGUvc3FsaXRlLmpzXCIpICkge1xuICAgIFxuICAgIG1vZHVsZS5ob3QuYWNjZXB0KCk7XG4gICAgbW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IHtcbiAgICAgICAgZ2xvYmFsLmhtclJlZnJlc2goeyB0eXBlOiBcInNjcmlwdFwiLCBwYXRoOiBcIkM6L2RldmVsb3AvTUFQZm9yUEFEL25vZGVfbW9kdWxlcy9uYXRpdmVzY3JpcHQtc3FsaXRlL3NxbGl0ZS5qc1wiIH0pO1xuICAgIH0pO1xufSAiLCIvKipcbiAqIFBhcnNlcyBqc29uIHN0cmluZyB0byBvYmplY3QgaWYgdmFsaWQuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlSlNPTihkYXRhKSB7XG4gICAgdmFyIG9EYXRhO1xuICAgIHRyeSB7XG4gICAgICAgIG9EYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIG9EYXRhO1xufVxuXG4vKipcbiAqIFdlYlZpZXdJbnRlcmZhY2UgQ2xhc3MgY29udGFpbmluZyBjb21tb24gZnVuY3Rpb25hbGl0aWVzIGZvciBBbmRyb2lkIGFuZCBpT1NcbiAqL1xuZnVuY3Rpb24gV2ViVmlld0ludGVyZmFjZSh3ZWJWaWV3KSB7XG4gICAgLyoqXG4gICAgICogV2ViVmlldyB0byBzZXR1cCBpbnRlcmZhY2UgZm9yXG4gICAgICovXG4gICAgdGhpcy53ZWJWaWV3ID0gd2ViVmlldztcbiAgICBcbiAgICAvKipcbiAgICAgKiBNYXBwaW5nIG9mIHdlYlZpZXcgZXZlbnQvY29tbWFuZCBhbmQgaXRzIG5hdGl2ZSBoYW5kbGVyIFxuICAgICAqL1xuICAgIHRoaXMuZXZlbnRMaXN0ZW5lck1hcCA9IHt9O1xuICAgIFxuICAgIC8qKlxuICAgICAqIE1hcHBpbmcgb2YganMgY2FsbCByZXF1ZXN0IGlkIGFuZCBpdHMgc3VjY2VzcyBoYW5kbGVyLiBcbiAgICAgKiBCYXNlZCBvbiB0aGlzIG1hcHBpbmcsIHRoZSByZWdpc3RlcmVkIHN1Y2Nlc3MgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCBcbiAgICAgKiBvbiBzdWNjZXNzZnVsIHJlc3BvbnNlIGZyb20gdGhlIGpzIGNhbGxcbiAgICAgKi9cbiAgICB0aGlzLmpzQ2FsbFJlcUlkU3VjY2Vzc0NhbGxiYWNrTWFwID0ge307XG4gICAgXG4gICAgLyoqXG4gICAgICogTWFwcGluZyBvZiBqcyBjYWxsIHJlcXVlc3QgaWQgYW5kIGl0cyBlcnJvciBoYW5kbGVyLiBcbiAgICAgKiBCYXNlZCBvbiB0aGlzIG1hcHBpbmcsIHRoZSBlcnJvciBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIFxuICAgICAqIG9uIGVycm9yIGZyb20gdGhlIGpzIGNhbGxcbiAgICAgKi9cbiAgICB0aGlzLmpzQ2FsbFJlcUlkRXJyb3JDYWxsYmFja01hcCA9IHt9O1xuICAgIFxuICAgIC8qKlxuICAgICAqIFdlYi12aWV3IGluc3RhbmNlIHVuaXF1ZSBpZCB0byBoYW5kbGUgc2NlbmFyaW9zIG9mIG11bHRpcGxlIHdlYnZpZXcgb24gc2luZ2xlIHBhZ2UuXG4gICAgICovXG4gICAgdGhpcy5pZCA9ICsrV2ViVmlld0ludGVyZmFjZS5jbnRXZWJWaWV3SWQ7XG4gICAgXG4gICAgLyoqXG4gICAgICogTWFpbnRhaW5pbmcgbWFwcGluZyBvZiB3ZWJ2aWV3IGluc3RhbmNlIGFuZCBpdHMgaWQsIHRvIGhhbmRsZSBzY2VuYXJpb3Mgb2YgbXVsdGlwbGUgd2VidmlldyBvbiBzaW5nbGUgcGFnZS5cbiAgICAgKi9cbiAgICBXZWJWaWV3SW50ZXJmYWNlLndlYlZpZXdJbnRlcmZhY2VJZE1hcFt0aGlzLmlkXSA9IHRoaXM7XG59XG5cbi8qKlxuICogUHJlcGFyZXMgY2FsbCB0byBhIGZ1bmN0aW9uIGluIHdlYlZpZXcsIHdoaWNoIGhhbmRsZXMgbmF0aXZlIGV2ZW50L2NvbW1hbmQgY2FsbHNcbiAqL1xuV2ViVmlld0ludGVyZmFjZS5wcm90b3R5cGUuX3ByZXBhcmVFbWl0RXZlbnRKU0NhbGwgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpOyAgICAvLyBjYWxsaW5nIHN0cmluZ2lmeSBmb3IgYWxsIHR5cGVzIG9mIGRhdGEuIEJlY2F1c2UgaWYgZGF0YSBpcyBhIHN0cmluZyBjb250YWluaW5nIFwiLCB3ZSBuZWVkIHRvIGVzY2FwZSB0aGF0LiBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9zaHJpcGFsc29uaTA0L25hdGl2ZXNjcmlwdC13ZWJ2aWV3LWludGVyZmFjZS9wdWxsLzZcbiAgICByZXR1cm4gJ3dpbmRvdy5uc1dlYlZpZXdJbnRlcmZhY2UuX29uTmF0aXZlRXZlbnQoXCInICsgZXZlbnROYW1lICsgJ1wiLCcgKyBkYXRhICsgJyk7J1xufTtcblxuLyoqXG4gKiBQcmVwYXJlcyBjYWxsIHRvIGEgZnVuY3Rpb24gaW4gd2ViVmlldywgd2hpY2ggY2FsbHMgdGhlIHNwZWNpZmllZCBmdW5jdGlvbiBpbiB0aGUgd2ViVmlld1xuICovXG5XZWJWaWV3SW50ZXJmYWNlLnByb3RvdHlwZS5fcHJlcGFyZUpTRnVuY3Rpb25DYWxsID0gZnVuY3Rpb24gKGZ1bmN0aW9uTmFtZSwgYXJyQXJncywgc3VjY2Vzc0hhbmRsZXIsIGVycm9ySGFuZGxlcikge1xuICAgIGFyckFyZ3MgPSBhcnJBcmdzIHx8IFtdO1xuICAgIFxuICAgIC8vIGNvbnZlcnRzIG5vbiBhcnJheSBhcmd1bWVudCB0byBhcnJheVxuICAgIGlmICh0eXBlb2YgYXJyQXJncyAhPT0gJ29iamVjdCcgfHwgYXJyQXJncy5sZW5ndGggPT09IHZvaWQgKDApKSB7XG4gICAgICAgIGFyckFyZ3MgPSBbYXJyQXJnc107XG4gICAgfVxuICAgIHZhciBzdHJBcmdzID0gSlNPTi5zdHJpbmdpZnkoYXJyQXJncyk7XG4gICAgLy8gY3JlYXRpbmcgaWQgd2l0aCBjb21iaW5hdGlvbiBvZiB3ZWItdmlldyBpZCBhbmQgcmVxIGlkXG4gICAgdmFyIHJlcUlkID0gJ1wiJyt0aGlzLmlkKycjJysgKCsrV2ViVmlld0ludGVyZmFjZS5jbnRKU0NhbGxSZXFJZCkrJ1wiJztcbiAgICB0aGlzLmpzQ2FsbFJlcUlkU3VjY2Vzc0NhbGxiYWNrTWFwW3JlcUlkXSA9IHN1Y2Nlc3NIYW5kbGVyO1xuICAgIHRoaXMuanNDYWxsUmVxSWRFcnJvckNhbGxiYWNrTWFwW3JlcUlkXSA9IGVycm9ySGFuZGxlcjtcbiAgICByZXR1cm4gJ3dpbmRvdy5uc1dlYlZpZXdJbnRlcmZhY2UuX2NhbGxKU0Z1bmN0aW9uKCcgKyByZXFJZCArICcsXCInICsgZnVuY3Rpb25OYW1lICsgJ1wiLCcgKyBzdHJBcmdzICsgJyk7J1xufVxuXG4vKipcbiAqIEhhbmRsZXMgcmVzcG9uc2UvZXZlbnQvY29tbWFuZCBmcm9tIHdlYlZpZXcuXG4gKi9cbldlYlZpZXdJbnRlcmZhY2UucHJvdG90eXBlLl9vbldlYlZpZXdFdmVudCA9IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEpIHtcbiAgICB2YXIgb0RhdGEgPSBwYXJzZUpTT04oZGF0YSkgfHwgZGF0YTtcbiAgICBcbiAgICAvLyBpbiBjYXNlIG9mIEpTIGNhbGwgcmVzdWx0LCBldmVudE5hbWUgd2lsbCBiZSBfanNDYWxsUmVzcG9uc2VcbiAgICBpZiAoZXZlbnROYW1lID09PSAnX2pzQ2FsbFJlc3BvbnNlJykge1xuICAgICAgICB2YXIgcmVxSWQgPSAnXCInK29EYXRhLnJlcUlkKydcIic7XG4gICAgICAgIHZhciBjYWxsYmFjaztcbiAgICAgICAgXG4gICAgICAgIGlmKG9EYXRhLmlzRXJyb3Ipe1xuICAgICAgICAgICAgY2FsbGJhY2sgPSB0aGlzLmpzQ2FsbFJlcUlkRXJyb3JDYWxsYmFja01hcFtyZXFJZF07XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgY2FsbGJhY2sgPSB0aGlzLmpzQ2FsbFJlcUlkU3VjY2Vzc0NhbGxiYWNrTWFwW3JlcUlkXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhvRGF0YS5yZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbHN0Q2FsbGJhY2tzID0gdGhpcy5ldmVudExpc3RlbmVyTWFwW2V2ZW50TmFtZV0gfHwgW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbHN0Q2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcmV0blZhbCA9IGxzdENhbGxiYWNrc1tpXShvRGF0YSk7XG4gICAgICAgICAgICBpZiAocmV0blZhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogUmVnaXN0ZXJzIGhhbmRsZXIgZm9yIGV2ZW50L2NvbW1hbmQgZW1pdHRlZCBmcm9tIHdlYnZpZXdcbiAqIEBwYXJhbSAgIHtzdHJpbmd9ICAgIGV2ZW50TmFtZSAtIEFueSBldmVudCBuYW1lIGV4Y2VwdCByZXNlcnZlZCAnX2pzQ2FsbFJlc3BvbnNlJ1xuICogQHBhcmFtICAge2Z1bmN0aW9ufSAgY2FsbGJhY2sgLSBDYWxsYmFjayBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBvbiBldmVudC9jb21tYW5kIHJlY2VpdmUuXG4gKi9cbldlYlZpZXdJbnRlcmZhY2UucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZihldmVudE5hbWUgPT09ICdfanNDYWxsUmVzcG9uc2UnKXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdfanNDYWxsUmVzcG9uc2UgZXZlbnROYW1lIGlzIHJlc2VydmVkIGZvciBpbnRlcm5hbCB1c2UuIFlvdSBjYW5ub3QgYXR0YWNoIGxpc3RlbmVycyB0byBpdC4nKTsgICAgXG4gICAgfVxuICAgIFxuICAgICh0aGlzLmV2ZW50TGlzdGVuZXJNYXBbZXZlbnROYW1lXSB8fCAodGhpcy5ldmVudExpc3RlbmVyTWFwW2V2ZW50TmFtZV0gPSBbXSkpLnB1c2goY2FsbGJhY2spO1xufTtcblxuLyoqXG4gKiBEZXJlZ2lzdGVycyBoYW5kbGVyIGZvciBldmVudC9jb21tYW5kIGVtaXR0ZWQgZnJvbSB3ZWJ2aWV3XG4gKiBAcGFyYW0gICB7c3RyaW5nfSAgICBldmVudE5hbWUgLSBBbnkgZXZlbnQgbmFtZSBleGNlcHQgcmVzZXJ2ZWQgJ19qc0NhbGxSZXNwb25zZSdcbiAqIEBwYXJhbSAgIHtmdW5jdGlvbn0gIGNhbGxiYWNrIC0gQ2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgb24gZXZlbnQvY29tbWFuZCByZWNlaXZlLlxuICoqL1xuV2ViVmlld0ludGVyZmFjZS5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZihldmVudE5hbWUgPT09ICdfanNDYWxsUmVzcG9uc2UnKXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdfanNDYWxsUmVzcG9uc2UgZXZlbnROYW1lIGlzIHJlc2VydmVkIGZvciBpbnRlcm5hbCB1c2UuIFlvdSBjYW5ub3QgZGVhdHRhY2ggbGlzdGVuZXJzIHRvIGl0LicpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5ldmVudExpc3RlbmVyTWFwW2V2ZW50TmFtZV0gfHwgdGhpcy5ldmVudExpc3RlbmVyTWFwW2V2ZW50TmFtZV0ubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmV2ZW50TGlzdGVuZXJNYXBbZXZlbnROYW1lXSA9IHRoaXMuZXZlbnRMaXN0ZW5lck1hcFtldmVudE5hbWVdLmZpbHRlcihmdW5jdGlvbihvbGRDYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gb2xkQ2FsbGJhY2sgIT09IGNhbGxiYWNrO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50TGlzdGVuZXJNYXBbZXZlbnROYW1lXTtcbiAgICB9XG59O1xuXG4vKipcbiAqIEVtaXRzIGV2ZW50L2NvbW1hbmQgd2l0aCBwYXlsb2FkIHRvIHdlYlZpZXcuXG4gKiBAcGFyYW0gICB7c3RyaW5nfSAgICBldmVudE5hbWUgLSBBbnkgZXZlbnQgbmFtZVxuICogQHBhcmFtICAge2FueX0gICAgICAgZGF0YSAtIFBheWxvYWQgdG8gc2VuZCB3aWh0IGV2ZW50L2NvbW1hbmRcbiAqL1xuV2ViVmlld0ludGVyZmFjZS5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEpIHtcbiAgICB2YXIgc3RySlNGdW5jdGlvbiA9IHRoaXMuX3ByZXBhcmVFbWl0RXZlbnRKU0NhbGwoZXZlbnROYW1lLCBkYXRhKTtcbiAgICB0aGlzLl9leGVjdXRlSlMoc3RySlNGdW5jdGlvbik7XG59XG5cbi8qKlxuICogQ2FsbHMgZnVuY3Rpb24gaW4gd2ViVmlld1xuICogQHBhcmFtICAge3N0cmluZ30gICAgZnVuY3Rpb25OYW1lIC0gRnVuY3Rpb24gc2hvdWxkIGJlIGluIGdsb2JhbCBzY29wZSBpbiB3ZWJWaWV3XG4gKiBAcGFyYW0gICB7YW55W119ICAgICBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBmdW5jdGlvblxuICogQHBhcmFtICAge2Z1bmN0aW9ufSAgY2FsbGJhY2sgLSBGdW5jdGlvbiB0byBjYWxsIG9uIHJlc3VsdCBmcm9tIHdlYlZpZXcgICAgICBcbiAqL1xuV2ViVmlld0ludGVyZmFjZS5wcm90b3R5cGUuY2FsbEpTRnVuY3Rpb24gPSBmdW5jdGlvbiAoZnVuY3Rpb25OYW1lLCBhcmdzLCBzdWNjZXNzSGFuZGxlciwgZXJyb3JIYW5kbGVyKSB7XG4gICAgdmFyIHN0ckpTRnVuY3Rpb24gPSB0aGlzLl9wcmVwYXJlSlNGdW5jdGlvbkNhbGwoZnVuY3Rpb25OYW1lLCBhcmdzLCBzdWNjZXNzSGFuZGxlciwgZXJyb3JIYW5kbGVyKTtcbiAgICB0aGlzLl9leGVjdXRlSlMoc3RySlNGdW5jdGlvbik7XG59O1xuXG4vKipcbiAqIENsZWFycyBtYXBwaW5ncyBvZiBjYWxsYmFja3MgYW5kIHdlYnZpZXcuXG4gKiBUaGlzIG5lZWRzIHRvIGJlIGNhbGxlZCBpbiBuYXZpZ2F0ZWRGcm9tIGV2ZW50IGhhbmRsZXIgaW4gcGFnZSB3aGVyZSB3ZWJ2aWV3SW50ZXJmYWNlIHBsdWdpbiBpcyB1c2VkLlxuICovXG5XZWJWaWV3SW50ZXJmYWNlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKXtcbiAgICAvLyBjYWxsIHBsYXRmb3JtIHNwZWNpZmljIGRlc3Ryb3kgZnVuY3Rpb24gaWYgYXZhaWxhYmxlLiBDdXJyZW50bHkgdXNlZCBvbmx5IGZvciBpT1MgdG8gcmVtb3ZlIGxvYWRTdGFydGVkIGV2ZW50IGxpc3RlbmVyLlxuICAgIGlmKHRoaXMuX2Rlc3Ryb3kpIHtcbiAgICAgICAgdGhpcy5fZGVzdHJveSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIFJlc2V0dGluZyBzcmMgdG8gYmxhbmsuIFRoaXMgbmVlZHMgdG8gYmUgZG9uZSB0byBhdm9pZCBpc3N1ZSBvZiBjb21tdW5pY2F0aW9uIHN0b3BzIHdvcmtpbmcgZnJvbSB3ZWJWaWV3IHRvIG5hdGl2ZXNjcmlwdCB3aGVuIFxuICAgICAqIHBhZ2Ugd2l0aCB3ZWJWZWl3IGlzIG9wZW5lZCBvbiBiYWNrIGJ1dHRvbiBwcmVzcyBvbiBhbmRyb2lkLlxuICAgICAqIFRoaXMgaXNzdWUgb2NjdXJzIGJlY2F1c2UgbmF0aXZlc2NyaXB0IGRlc3Ryb3lzIHRoZSBuYXRpdmUgd2ViVmlldyBlbGVtZW50IG9uIG5hdmlnYXRpb24gaWYgY2FjaGUgaXMgZGlzYWJsZWQsIGFuZCB3aGVuIHdlIG5hdmlnYXRlIGJhY2tcbiAgICAgKiBpdCByZWNyZWF0ZXMgdGhlIG5hdGl2ZSB3ZWJWaWV3IGFuZCBhdHRhY2hlcyBpdCB0byBuYXRpdmVzY3JpcHQgd2ViVmlldyBlbGVtZW50LiBTbyB3ZSBoYXZlIHRvIHJlaW5pdGlhdGUgdGhpcyBwbHVnaW4gd2l0aCBuZXcgd2ViVmlldyBpbnN0YW5jZS5cbiAgICAgKiBOb3csIHRvIG1ha2UgY29tbXVuaWNhdGlvbiBmcm9tIHdlYlZlaXcgdG8gbmF0aXZlc2NyaXB0IHdvcmsgb24gYW5kcm9pZCwgXG4gICAgICogYW5kcm9pZEpTSW50ZXJmYWNlIHNob3VsZCBiZSBsb2FkZWQgYmVmb3JlIGFueSByZXF1ZXN0IGxvYWRzIG9uIHdlYlZpZXcuIFNvIGlmIHdlIGRvbid0IHJlc2V0IHNyYyBvbiBuYXRpdmVzY3JpcHQgd2ViVmlldywgdGhhdCBzcmMgd2lsbCBzdGFydFxuICAgICAqIGxvYWRpbmcgYXMgc29vbiBhcyB0aGUgbmF0aXZlIHdlYlZpZXcgaXMgY3JlYXRlZCBhbmQgYmVmb3JlIHdlIGFkZCBhbmRyb2lkSlNJbnRlcmZhY2UuIFRoaXMgcmVzdWx0cyBpbiBzdG9wcGFnZSBvZiBjb21tdW5pY2F0aW9uIGZyb20gd2ViVmlldyBcbiAgICAgKiB0byBuYXRpdmVzY3JpcHQgd2hlbiBwYWdlIGlzIG9wZW5lZCBvbiBiYWNrIG5hdmlnYXRpb24uXG4gICAgICovXG4gICAgaWYodGhpcy53ZWJWaWV3KSB7XG4gICAgICAgIHRoaXMud2ViVmlldy5zcmMgPSAnJztcbiAgICB9XG5cbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJNYXAgPSBudWxsO1xuICAgIHRoaXMuanNDYWxsUmVxSWRTdWNjZXNzQ2FsbGJhY2tNYXAgPSBudWxsO1xuICAgIHRoaXMuanNDYWxsUmVxSWRFcnJvckNhbGxiYWNrTWFwID0gbnVsbDtcbiAgICBkZWxldGUgV2ViVmlld0ludGVyZmFjZS53ZWJWaWV3SW50ZXJmYWNlSWRNYXBbdGhpcy5pZF07IFxufTtcblxuLyoqXG4gKiBDb3VudGVyIHRvIGNyZWF0ZSB1bmlxdWUgcmVxdWVzdElkIGZvciBlYWNoIEpTIGNhbGwgdG8gd2ViVmlldy5cbiAqL1xuV2ViVmlld0ludGVyZmFjZS5jbnRKU0NhbGxSZXFJZCA9IDA7XG5XZWJWaWV3SW50ZXJmYWNlLmNudFdlYlZpZXdJZCA9IDA7XG5XZWJWaWV3SW50ZXJmYWNlLndlYlZpZXdJbnRlcmZhY2VJZE1hcCA9IHt9O1xuXG5leHBvcnRzLldlYlZpZXdJbnRlcmZhY2UgPSBXZWJWaWV3SW50ZXJmYWNlO1xuZXhwb3J0cy5wYXJzZUpTT04gPSBwYXJzZUpTT047OyBcbmlmIChtb2R1bGUuaG90ICYmIGdsb2JhbC5faXNNb2R1bGVMb2FkZWRGb3JVSSAmJiBnbG9iYWwuX2lzTW9kdWxlTG9hZGVkRm9yVUkoXCJDOi9kZXZlbG9wL01BUGZvclBBRC9ub2RlX21vZHVsZXMvbmF0aXZlc2NyaXB0LXdlYnZpZXctaW50ZXJmYWNlL2luZGV4LWNvbW1vbi5qc1wiKSApIHtcbiAgICBcbiAgICBtb2R1bGUuaG90LmFjY2VwdCgpO1xuICAgIG1vZHVsZS5ob3QuZGlzcG9zZSgoKSA9PiB7XG4gICAgICAgIGdsb2JhbC5obXJSZWZyZXNoKHsgdHlwZTogXCJzY3JpcHRcIiwgcGF0aDogXCJDOi9kZXZlbG9wL01BUGZvclBBRC9ub2RlX21vZHVsZXMvbmF0aXZlc2NyaXB0LXdlYnZpZXctaW50ZXJmYWNlL2luZGV4LWNvbW1vbi5qc1wiIH0pO1xuICAgIH0pO1xufSAiLCIgY29uc3QgY29tbW9uID0gcmVxdWlyZShcIi4vaW5kZXgtY29tbW9uXCIpO1xuIGNvbnN0IHBsYXRmb3JtTW9kdWxlID0gcmVxdWlyZShcInBsYXRmb3JtXCIpO1xuXG4gZ2xvYmFsLm1vZHVsZU1lcmdlKGNvbW1vbiwgZXhwb3J0cyk7XG4gXG4gLyoqXG4gICogRmFjdG9yeSBmdW5jdGlvbiB0byBwcm92aWRlIGluc3RhbmNlIG9mIEFuZHJvaWQgSmF2YXNjcmlwdEludGVyZmFjZS4gICAgICBcbiAgKi8gXG4gZnVuY3Rpb24gZ2V0QW5kcm9pZEpTSW50ZXJmYWNlKG9XZWJWaWV3SW50ZXJmYWNlKXtcbiAgICB2YXIgQW5kcm9pZFdlYlZpZXdJbnRlcmZhY2UgPSBjb20uc2hyaXBhbHNvbmkubmF0aWVzY3JpcHR3ZWJ2aWV3aW50ZXJmYWNlLldlYlZpZXdJbnRlcmZhY2UuZXh0ZW5kKHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIGNhbGwgZnJvbSB3ZWJWaWV3IHRvIGFuZHJvaWQsIHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGZyb20gaGFuZGxlRXZlbnRGcm9tV2ViVmlldyBtZXRob2Qgb2YgV2ViVmlld0luZXJmYWNlIGNsYXNzXG4gICAgICAgICAqL1xuICAgICAgICBvbldlYlZpZXdFdmVudDogZnVuY3Rpb24od2ViVmlld0lkLCBldmVudE5hbWUsIGpzb25EYXRhKXtcbiAgICAgICAgICAgIC8vIGdldHRpbmcgd2Vidmlld0ludGVyZmFjZSBvYmplY3QgYnkgd2ViVmlld0lkIGZyb20gc3RhdGljIG1hcC5cbiAgICAgICAgICAgIHZhciBvV2ViVmlld0ludGVyZmFjZSA9IGdldFdlYlZpZXdJbnRlZmFjZU9iakJ5V2ViVmlld0lkKHdlYlZpZXdJZCk7XG4gICAgICAgICAgICBpZiAob1dlYlZpZXdJbnRlcmZhY2UpIHtcbiAgICAgICAgICAgICAgICBvV2ViVmlld0ludGVyZmFjZS5fb25XZWJWaWV3RXZlbnQoZXZlbnROYW1lLCBqc29uRGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICAvLyBjcmVhdGluZyBhbmRyb2lkV2ViVmlld0ludGVyZmFjZSB3aXRoIHVuaXF1ZSB3ZWItdmlldyBpZC5cbiAgICByZXR1cm4gbmV3IEFuZHJvaWRXZWJWaWV3SW50ZXJmYWNlKG5ldyBqYXZhLmxhbmcuU3RyaW5nKCcnK29XZWJWaWV3SW50ZXJmYWNlLmlkKSk7XG4gfVxuIFxuIC8qKlxuICAqIFJldHVybnMgd2ViVmlld0ludGVyZmFjZSBvYmplY3QgbWFwcGVkIHdpdGggdGhlIHBhc3NlZCB3ZWJWaWV3SWQuXG4gICovXG4gZnVuY3Rpb24gZ2V0V2ViVmlld0ludGVmYWNlT2JqQnlXZWJWaWV3SWQod2ViVmlld0lkKXtcbiAgICAgcmV0dXJuIGNvbW1vbi5XZWJWaWV3SW50ZXJmYWNlLndlYlZpZXdJbnRlcmZhY2VJZE1hcFt3ZWJWaWV3SWRdO1xuIH1cbiBcbiAvKipcbiAgKiBBbmRyb2lkIFNwZWNpZmljIFdlYlZpZXdJbnRlcmZhY2UgQ2xhc3NcbiAgKi9cbiB2YXIgV2ViVmlld0ludGVyZmFjZSA9IChmdW5jdGlvbihfc3VwZXIpe1xuICAgIF9fZXh0ZW5kcyhXZWJWaWV3SW50ZXJmYWNlLCBfc3VwZXIpO1xuICAgIFxuICAgIGZ1bmN0aW9uIFdlYlZpZXdJbnRlcmZhY2Uod2ViVmlldywgc3JjKXtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgd2ViVmlldyk7XG4gICAgICAgIHRoaXMuX2luaXRXZWJWaWV3KHNyYyk7IFxuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyB3ZWJWaWV3IGZvciBjb21tdW5pY2F0aW9uIGJldHdlZW4gYW5kcm9pZCBhbmQgd2ViVmlldy5cbiAgICAgKi9cbiAgICBXZWJWaWV3SW50ZXJmYWNlLnByb3RvdHlwZS5faW5pdFdlYlZpZXcgPSBmdW5jdGlvbihzcmMpe1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZih0aGlzLndlYlZpZXcuaXNMb2FkZWQpIHtcbiAgICAgICAgICAgIF90aGlzLl9zZXRBbmRyb2lkV2ViVmlld1NldHRpbmdzKHNyYyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlclJlZiA9IF90aGlzLndlYlZpZXcub24oJ2xvYWRlZCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgX3RoaXMuX3NldEFuZHJvaWRXZWJWaWV3U2V0dGluZ3Moc3JjKTtcbiAgICAgICAgICAgICAgICBfdGhpcy53ZWJWaWV3Lm9mZignbG9hZGVkJywgaGFuZGxlclJlZik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgV2ViVmlld0ludGVyZmFjZS5wcm90b3R5cGUuX3NldEFuZHJvaWRXZWJWaWV3U2V0dGluZ3MgPSBmdW5jdGlvbihzcmMpIHtcbiAgICAgICAgdmFyIG9KU0ludGVyZmFjZSA9ICBnZXRBbmRyb2lkSlNJbnRlcmZhY2UodGhpcyk7XG4gICAgICAgIHZhciBhbmRyb2lkU2V0dGluZ3MgPSB0aGlzLndlYlZpZXcuYW5kcm9pZC5nZXRTZXR0aW5ncygpO1xuICAgICAgICBhbmRyb2lkU2V0dGluZ3Muc2V0SmF2YVNjcmlwdEVuYWJsZWQodHJ1ZSk7XG4gICAgICAgIHRoaXMud2ViVmlldy5hbmRyb2lkLmFkZEphdmFzY3JpcHRJbnRlcmZhY2Uob0pTSW50ZXJmYWNlLCAnYW5kcm9pZFdlYlZpZXdJbnRlcmZhY2UnKTtcblxuICAgICAgICAvLyBJZiBzcmMgaXMgcHJvdmlkZWQsIHRoZW4gc2V0dGluZyBpdC5cbiAgICAgICAgLy8gVG8gbWFrZSBqYXZhc2NyaXB0SW50ZXJmYWNlIGF2YWlsYWJsZSBpbiB3ZWItdmlldywgaXQgc2hvdWxkIGJlIHNldCBiZWZvcmUgXG4gICAgICAgIC8vIHdlYi12aWV3J3MgbG9hZFVybCBtZXRob2QgaXMgY2FsbGVkLiBTbyBzZXR0aW5nIHNyYyBhZnRlciBqYXZhc2NyaXB0SW50ZXJmYWNlIGlzIHNldC5cbiAgICAgICAgaWYoc3JjKXtcbiAgICAgICAgICAgIHRoaXMud2ViVmlldy5zcmMgPSBzcmM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlcyBldmVudC9jb21tYW5kL2pzRnVuY3Rpb24gaW4gd2ViVmlldy5cbiAgICAgKi9cbiAgICBXZWJWaWV3SW50ZXJmYWNlLnByb3RvdHlwZS5fZXhlY3V0ZUpTID0gZnVuY3Rpb24oc3RySlNGdW5jdGlvbil7XG4gICAgICBpZiAocGxhdGZvcm1Nb2R1bGUuZGV2aWNlLnNka1ZlcnNpb24gPj0gMTkpIHtcbiAgICAgICAgdGhpcy53ZWJWaWV3LmFuZHJvaWQuZXZhbHVhdGVKYXZhc2NyaXB0KHN0ckpTRnVuY3Rpb24sIG51bGwpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMud2ViVmlldy5hbmRyb2lkLmxvYWRVcmwoJ2phdmFzY3JpcHQ6JytzdHJKU0Z1bmN0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBXZWJWaWV3SW50ZXJmYWNlO1xuIH0pKGNvbW1vbi5XZWJWaWV3SW50ZXJmYWNlKTtcbiBcbiBleHBvcnRzLldlYlZpZXdJbnRlcmZhY2UgPSBXZWJWaWV3SW50ZXJmYWNlO1xuOyBcbmlmIChtb2R1bGUuaG90ICYmIGdsb2JhbC5faXNNb2R1bGVMb2FkZWRGb3JVSSAmJiBnbG9iYWwuX2lzTW9kdWxlTG9hZGVkRm9yVUkoXCJDOi9kZXZlbG9wL01BUGZvclBBRC9ub2RlX21vZHVsZXMvbmF0aXZlc2NyaXB0LXdlYnZpZXctaW50ZXJmYWNlL2luZGV4LmpzXCIpICkge1xuICAgIFxuICAgIG1vZHVsZS5ob3QuYWNjZXB0KCk7XG4gICAgbW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IHtcbiAgICAgICAgZ2xvYmFsLmhtclJlZnJlc2goeyB0eXBlOiBcInNjcmlwdFwiLCBwYXRoOiBcIkM6L2RldmVsb3AvTUFQZm9yUEFEL25vZGVfbW9kdWxlcy9uYXRpdmVzY3JpcHQtd2Vidmlldy1pbnRlcmZhY2UvaW5kZXguanNcIiB9KTtcbiAgICB9KTtcbn0gIl0sInNvdXJjZVJvb3QiOiIifQ==