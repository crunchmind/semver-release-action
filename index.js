const core = require('@actions/core');
const exec = require('@actions/exec');
const semver = require('semver');

/**
 * convert the version string to semver object and return the higher version.
 * @param {Array} tags list of tags.
 */
async function getMostRecentRepoTag(tags) {
  const versions = tags
      .map((tag) => semver.parse(tag, {loose: true}))
      .filter((version) => version !== null)
      .sort(semver.rcompare);

  return versions[0] || semver.parse('0.0.0');
}

/**
 * fetch the list of tags from cwd.
 * @param  {string} cwd
 */
async function getTags(cwd) {
  console.log(`Getting list of tags from branch`);
  let output = '';
  let err = '';
  const options = {};
  options.listeners = {
    stdout: (data) => {
      output += data.toString();
    },
    stderr: (data) => {
      err += data.toString();
    },
  };
  options.silent = true;
  options.cwd = cwd || './';
  let exitCode = await exec.exec(`/usr/bin/git`, ['fetch', '--tags', '--quiet'],
      options);
  if (exitCode != 0) {
    console.log(err);
    process.exit(exitCode);
  }
  exitCode = await exec.exec(`/usr/bin/git`, ['tag', '--no-column', '--merged'],
      options);
  if (exitCode != 0) {
    console.log(err);
    process.exit(exitCode);
  }
  return output.split('\n');
}

/** run the program
 */
async function run() {
  try {
    const bump = core.getInput('bump', {required: true});
    const tags = await getTags();
    const latestTag = await getMostRecentRepoTag(tags);
    const identifier = core.getInput('preid', {required: false}) || '';
    console.log(`latestTag ${latestTag}`);
    version = semver.inc(latestTag, bump, identifier);
    console.log(`version ${version}`);

    const prefix = core.getInput('prefix', {required: false}) || 'v';
    const versionTag = prefix + version.toString();
    core.exportVariable('VERSION', version.toString());
    core.setOutput('version', version.toString());
    console.log(`Result: "${version.toString()}" (tag: "${versionTag}")`);
  } catch (error) {
    core.setFailed(error.message);
  }
}


run();

module.exports = getMostRecentRepoTag