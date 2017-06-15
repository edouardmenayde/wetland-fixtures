const {Wetland} = require('wetland');
const {seed}    = require('../../src/index.js');
const path      = require('path');
const tmpDir    = path.join(__dirname, '../.tmp');
const {assert}  = require('chai');

class User {
  static setMapping(mapping) {
    mapping.forProperty('id').increments().primary();
    mapping.forProperty('username').field({type: 'string'});
    mapping.forProperty('password').field({type: 'string'});
  }
}

function getWetland() {
  return new Wetland({
    dataDirectory: `${tmpDir}/.data`,
    stores       : {
      // defaultStore: {
      //   client    : 'mysql',
      //   connection: {
      //     host    : '127.0.0.1',
      //     user    : 'root',
      //     password: '',
      //     database: 'wetlandfixtures'
      //   }
      // },
      defaultStore: {
        client          : 'sqlite3',
        useNullAsDefault: true,
        connection      : {
          filename: `${tmpDir}/wetlandfixtures.sqlite`
        }
      }
    },
    entities     : [User],
    // debug: true
  });
}

const users = [
  {
    id      : 90,
    username: 'Test',
    password: 'jkladhjskhioasdjkl'
  },
  {
    id      : 180,
    username: 'Ytes',
    password: '45678423123'
  }
];

describe('Fixtures', () => {

  before((done) => {
    require('rimraf')(tmpDir, error => {
      if (error) {
        done(error);
      }

      done();
    });
  });

  describe('Populate', () => {
    it('Should populate', () => {

      const wetland  = getWetland();
      const migrator = wetland.getMigrator();

      return migrator.devMigrations()
        .then(() => {
          return seed(wetland, {
            User: users
          })
            .then(() => {
              const manager = wetland.getManager();

              return manager.getRepository('User').find()
                .then(users => {
                  console.log(users)
                });
            })
        });
    });

  });
});
