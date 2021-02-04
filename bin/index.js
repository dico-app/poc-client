#!/usr/bin/env node
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const client = require("../src");
const logger = require("consola").withScope("dico.app");

const PROJECT_ROOT = process.cwd();
const DICO_CONFIG = path.join(PROJECT_ROOT, "dico.config.js");
const DICO_ROOT = path.join(PROJECT_ROOT, ".dico");
const DICO_FILE = path.join(DICO_ROOT, "index.json");

const config = require(DICO_CONFIG);

const dico = client.resolveConfig(config);

if (fs.existsSync(DICO_ROOT)) {
  if (fs.existsSync(DICO_FILE)) {
    fs.unlinkSync(DICO_FILE);
  }
} else {
  fs.mkdirSync(DICO_ROOT);
}
fs.writeFileSync(DICO_FILE, JSON.stringify(dico), "utf8");

logger.success("dico has been updated!");
