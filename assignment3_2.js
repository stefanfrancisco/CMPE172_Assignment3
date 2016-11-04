var fs = require('fs')
var Transform = require('stream').Transform
var inherits = require('util').inherits
var program = require('commander')
var through2 = require('through2')
var split2 = require('split2')
var colors = require('colors');
var input = '';

/**
* Turns bears class to a transform stream
*/
function PatternMatch() {
Transform.call(
	this,
	{
		objectMode:true
	})
} inherits(PatternMatch, Transform)
/**
* Called by the stream when data is written to it
*/
PatternMatch.prototype._transform = function(chunk,enc,done) {
	var string = chunk.toString()
	var result = string.replace(/\n/, '').split(program.pattern)
	this.push(result)
	done()

}

PatternMatch.prototype._flush = function (flushCompleted) {
	if(this._lastLineData) this.push(this._lastLineData)
	this._lastLineData = null
	flushCompleted()
}
/**
 * Allows for custom input in terminal
 */
program
	.option('-p, --pattern <pattern>', 'Input Pattern such as . ,')
	.parse(process.argv)


/**
 * Read file, save to input variable for later print
 */
var inputStream = fs.createReadStream("input.txt")
inputStream
  .on('data', function (chunk) {
    input += chunk;
  })


/**
 * Time to print
 */
var patternStream = inputStream.pipe(new PatternMatch())

patternStream.on('data', function(data) {
	console.log('\n')
	console.log("----------------Input----------------\n")
	console.log(colors.bgRed(input), '\n')
	console.log('----------------Output----------------')
	console.log(data)
})

process.stdin
	.pipe(patternStream)
