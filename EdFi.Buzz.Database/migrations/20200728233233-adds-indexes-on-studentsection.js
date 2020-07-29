'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  db.runSql('CREATE INDEX studentsection_sectionkey_idx ON buzz.studentsection (sectionkey);');
  db.runSql('CREATE INDEX studentsection_studentschoolkey_idx ON buzz.studentsection (studentschoolkey);');
  return null;
};

exports.down = function (db) {
  db.runSql('DROP INDEX buzz.studentsection_sectionkey_idx');
  db.runSql('DROP INDEX buzz.studentsection_studentschoolkey_idx');
  return null;
};

exports._meta = {
  "version": 1
};
