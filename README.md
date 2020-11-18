# Semantic Versioning Release Action

This action locates the current version of the repository using its tags, increments it based on the inputs, then creates a tag for that new version at the current commit. Use it to automate the release deployment of a project.

## Inputs

### `bump`

**Required** The type of semantic version increment to make. One of `major`, `premajor`, `minor`, `preminor`, `patch`, `prepatch`, or `prerelease`.

### `prefix`

**Optional**. Version prefix used to create tag. Usually empty or `v` or `=`.

## Outputs

### `version`

The full version number produced by incrementing the semantic version number of the latest tag according to the `bump` input. For instance, given `12.4.1` and `bump: minor`, `12.5.0`.

## Example usage

### Simple

Create a version, f.ex., when merging to master.

```yaml
- id: bump
  uses: crunchmind/match-label-action@v1
  with:
    allowed: major,minor,patch
- uses: crunchmind/semver-release-action@v1
  with:
    bump: ${{ steps.bump.outputs.match }}

```
