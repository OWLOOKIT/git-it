#!/usr/bin/env node

var spawn = require('child_process').spawn
var concat = require('concat-stream')

var ref = spawn('git', ['reflog', '-10'])
var username = spawn('git', ['config', 'user.username'])

var user = ""

ref.stdout.pipe(concat(onRef))
username.stdout.pipe(concat(onUser))

// check that they performed a merge
// check there is not username named branch

function onRef(output) {
  var ref = output.toString().trim()
  if (ref.match("merge")) 
    console.log("Branch has been merged!")
  else return console.log("No merge in the history.")
}

function onUser(output) {
  user = output.toString().trim()
  getBranches(onBranch)
}

function getBranches(callback) {
  var branches = spawn('git', ['branch'])
   branches.stdout.pipe(concat(callback))
}

function onBranch(output) {
  var branch = output.toString().trim()
  if (branch.match(user)) {
    console.log("Uh oh, branch is still there.")
  }
  else return console.log("Branch deleted!")
}