var _ = require('underscore')
  , fs = require('fs')
  , assert = require('assert')
  , utils = require('../lib/utils')
  , assertAllValuesApprox = require('./helpers').assertAllValuesApprox
  , assertApproxEqual = require('./helpers').assertApproxEqual


describe('utils', function() {

  describe('decodeAudio', function() {
      
    var helpers = require('./helpers')({approx: 0.0005})

    var reblock = function(audioBuffer, blockSize) {
      var blocks = []
      while(audioBuffer.length) {
        blocks.push(audioBuffer.slice(0, blockSize))
        audioBuffer = audioBuffer.slice(blockSize)
      }
      return blocks
    }

    // Test cases for the files "steps-*-mono.wav"
    var testStepsMono = function(blocks, helpers) {
      helpers.assertAllValuesApprox(blocks[0].getChannelData(0), -1)
      helpers.assertAllValuesApprox(blocks[1].getChannelData(0), -0.9)
      helpers.assertAllValuesApprox(blocks[2].getChannelData(0), -0.8)
      helpers.assertAllValuesApprox(blocks[3].getChannelData(0), -0.7)
      helpers.assertAllValuesApprox(blocks[4].getChannelData(0), -0.6)
      helpers.assertAllValuesApprox(blocks[5].getChannelData(0), -0.5)
      helpers.assertAllValuesApprox(blocks[6].getChannelData(0), -0.4)
      helpers.assertAllValuesApprox(blocks[7].getChannelData(0), -0.3)
      helpers.assertAllValuesApprox(blocks[8].getChannelData(0), -0.2)
      helpers.assertAllValuesApprox(blocks[9].getChannelData(0), -0.1)
      helpers.assertAllValuesApprox(blocks[10].getChannelData(0), 0)
      helpers.assertAllValuesApprox(blocks[11].getChannelData(0), 0.1)
      helpers.assertAllValuesApprox(blocks[12].getChannelData(0), 0.2)
      helpers.assertAllValuesApprox(blocks[13].getChannelData(0), 0.3)
      helpers.assertAllValuesApprox(blocks[14].getChannelData(0), 0.4)
      helpers.assertAllValuesApprox(blocks[15].getChannelData(0), 0.5)
      helpers.assertAllValuesApprox(blocks[16].getChannelData(0), 0.6)
      helpers.assertAllValuesApprox(blocks[17].getChannelData(0), 0.7)
      helpers.assertAllValuesApprox(blocks[18].getChannelData(0), 0.8)
      helpers.assertAllValuesApprox(blocks[19].getChannelData(0), 0.9)
      helpers.assertAllValuesApprox(blocks[20].getChannelData(0), 1)
    }

    // Test cases for the files "steps-*-stereo.wav"
    var testStepsStereo = function(blocks, helpers) {
      helpers.assertAllValuesApprox(blocks[0].getChannelData(0), -1)
      helpers.assertAllValuesApprox(blocks[0].getChannelData(1), 1)
      helpers.assertAllValuesApprox(blocks[1].getChannelData(0), -0.9)
      helpers.assertAllValuesApprox(blocks[1].getChannelData(1), 0.9)
      helpers.assertAllValuesApprox(blocks[2].getChannelData(0), -0.8)
      helpers.assertAllValuesApprox(blocks[2].getChannelData(1), 0.8)
      helpers.assertAllValuesApprox(blocks[3].getChannelData(0), -0.7)
      helpers.assertAllValuesApprox(blocks[3].getChannelData(1), 0.7)
      helpers.assertAllValuesApprox(blocks[4].getChannelData(0), -0.6)
      helpers.assertAllValuesApprox(blocks[4].getChannelData(1), 0.6)
      helpers.assertAllValuesApprox(blocks[5].getChannelData(0), -0.5)
      helpers.assertAllValuesApprox(blocks[5].getChannelData(1), 0.5)
      helpers.assertAllValuesApprox(blocks[6].getChannelData(0), -0.4)
      helpers.assertAllValuesApprox(blocks[6].getChannelData(1), 0.4)
      helpers.assertAllValuesApprox(blocks[7].getChannelData(0), -0.3)
      helpers.assertAllValuesApprox(blocks[7].getChannelData(1), 0.3)
      helpers.assertAllValuesApprox(blocks[8].getChannelData(0), -0.2)
      helpers.assertAllValuesApprox(blocks[8].getChannelData(1), 0.2)
      helpers.assertAllValuesApprox(blocks[9].getChannelData(0), -0.1)
      helpers.assertAllValuesApprox(blocks[9].getChannelData(1), 0.1)

      helpers.assertAllValuesApprox(blocks[10].getChannelData(0), 0)
      helpers.assertAllValuesApprox(blocks[10].getChannelData(1), 0)

      helpers.assertAllValuesApprox(blocks[11].getChannelData(0), 0.1)
      helpers.assertAllValuesApprox(blocks[11].getChannelData(1), -0.1)
      helpers.assertAllValuesApprox(blocks[12].getChannelData(0), 0.2)
      helpers.assertAllValuesApprox(blocks[12].getChannelData(1), -0.2)
      helpers.assertAllValuesApprox(blocks[13].getChannelData(0), 0.3)
      helpers.assertAllValuesApprox(blocks[13].getChannelData(1), -0.3)
      helpers.assertAllValuesApprox(blocks[14].getChannelData(0), 0.4)
      helpers.assertAllValuesApprox(blocks[14].getChannelData(1), -0.4)
      helpers.assertAllValuesApprox(blocks[15].getChannelData(0), 0.5)
      helpers.assertAllValuesApprox(blocks[15].getChannelData(1), -0.5)
      helpers.assertAllValuesApprox(blocks[16].getChannelData(0), 0.6)
      helpers.assertAllValuesApprox(blocks[16].getChannelData(1), -0.6)
      helpers.assertAllValuesApprox(blocks[17].getChannelData(0), 0.7)
      helpers.assertAllValuesApprox(blocks[17].getChannelData(1), -0.7)
      helpers.assertAllValuesApprox(blocks[18].getChannelData(0), 0.8)
      helpers.assertAllValuesApprox(blocks[18].getChannelData(1), -0.8)
      helpers.assertAllValuesApprox(blocks[19].getChannelData(0), 0.9)
      helpers.assertAllValuesApprox(blocks[19].getChannelData(1), -0.9)
      helpers.assertAllValuesApprox(blocks[20].getChannelData(0), 1)
      helpers.assertAllValuesApprox(blocks[20].getChannelData(1), -1)
    }

    it('should decode a 16b mono wav', function(done) {
      fs.readFile(__dirname + '/sounds/steps-mono-16b-44khz.wav', function(err, buf) {
        if (err) throw err
        utils.decodeAudio(buf, function(err, audioBuffer) {
          if (err) throw err
          assert.equal(audioBuffer.numberOfChannels, 1)
          assert.equal(audioBuffer.length, 21 * 4410)
          assert.equal(audioBuffer.sampleRate, 44100)
          testStepsMono(reblock(audioBuffer, 4410), helpers)
          done()
        })
      })
    })

    it('should decode a 16b stereo wav', function(done) {
      fs.readFile(__dirname + '/sounds/steps-stereo-16b-44khz.wav', function(err, buf) {
        if (err) throw err
        utils.decodeAudio(buf, function(err, audioBuffer) {
          if (err) throw err
          assert.equal(audioBuffer.numberOfChannels, 2)
          assert.equal(audioBuffer.length, 21 * 4410)
          assert.equal(audioBuffer.sampleRate, 44100)
          testStepsStereo(reblock(audioBuffer, 4410), helpers)
          done()
        })
      })
    })

  })

})