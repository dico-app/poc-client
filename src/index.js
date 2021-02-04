const path = require("path");
const fs = require("fs");
const semver = require("semver");
const { timeStamp } = require("console");

const DICO_ROOT = path.join(__dirname, "../.dico");
const ACCESS_TOKENS = {
  ekina: "d06f9f9ec0e427efd22e258128ee879770b7642e333ad0c36ea477cc69ad0f7a"
};

class Collection {
  constructor(collection) {
    this.path = collection;
  }

  get(version) {
    if (!version) {
      version = this.getBestVersion();
    }

    const result = JSON.parse(
      fs.readFileSync(path.join(this.getPath(), `${version}.json`))
    );

    result.__meta = {
      path: this.path,
      version,
      type: "string"
    };

    return result;
  }

  getPath() {
    return path.join(DICO_ROOT, this.path);
  }

  getVersions() {
    return fs.readdirSync(this.getPath()).map(i => i.replace(".json", ""));
  }

  getBestVersion(version = "*") {
    if (version === "latest") {
      version = "*";
    }

    return semver.maxSatisfying(this.getVersions(), version);
  }
}

const resolveConfig = config => {
  const results = {};

  for (const key in config.collections) {
    if (Object.hasOwnProperty.call(config.collections, key)) {
      const rule = config.collections[key];

      const [collectionPath, version] = rule.split("@");
      const [project] = collectionPath.split("/", 1);

      if (
        !config.credentials[project] ||
        config.credentials[project] !== ACCESS_TOKENS[project]
      ) {
        throw new Error(`Invalid token for project: "${project}"`);
      }

      const collection = new Collection(collectionPath);

      const bestVersion = collection.getBestVersion(version);

      if (!bestVersion) {
        throw new Error(`No version match for: "${rule}"`);
      }

      results[key] = collection.get(bestVersion);
    }
  }

  return results;
};

module.exports = {
  resolveConfig
};
