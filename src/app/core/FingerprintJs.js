var test = null
var check = ''
var state = document.getElementById('content-capture')

var myVal = '' // Drop down selected value of reader
var disabled = true
var startEnroll = false

var currentFormat = Fingerprint.SampleFormat.PngImage
var deviceTechn = {
  0: 'Unknown',
  1: 'Optical',
  2: 'Capacitive',
  3: 'Thermal',
  4: 'Pressure',
}

var deviceModality = {
  0: 'Unknown',
  1: 'Swipe',
  2: 'Area',
  3: 'AreaMultifinger',
}

var deviceUidType = {
  0: 'Persistent',
  1: 'Volatile',
}

var FingerprintSdkTest = (function() {
  function FingerprintSdkTest() {
    var _instance = this

    this.operationToRestart = null
    this.acquisitionStarted = false
    this.sdk = new Fingerprint.WebApi
    this.sdk.onDeviceConnected = function(e) {
      // Detects if the deveice is connected for which acquisition started
      showMessage('Scan your finger')
    }
    this.sdk.onDeviceDisconnected = function(e) {
      // Detects if device gets disconnected - provides deviceUid of disconnected device
      showMessage('Device disconnected')
    }
    this.sdk.onCommunicationFailed = function(e) {
      // Detects if there is a failure in communicating with U.R.U web SDK
      showMessage('Communinication Failed')
    }
    this.sdk.onSamplesAcquired = function(s) {
      // Sample acquired event triggers this function
       ;
      sampleAcquired(s)
    }
    this.sdk.onQualityReported = function(e) {
      // Quality of sample aquired - Function triggered on every sample acquired
      document.getElementById('qualityInputBox').value = Fingerprint.QualityCode[(e.quality)]
    }

  }

  FingerprintSdkTest.prototype.startCapture = function() {
    if (this.acquisitionStarted) // Monitoring if already started capturing
      return
    var _instance = this
    showMessage('')
    this.operationToRestart = this.startCapture
    this.sdk.startAcquisition(currentFormat, myVal).then(function() {
      _instance.acquisitionStarted = true

      //Disabling start once started

    }, function(error) {
      showMessage(error.message)
    })
  }
  FingerprintSdkTest.prototype.stopCapture = function() {
    if (!this.acquisitionStarted) //Monitor if already stopped capturing
      return
    var _instance = this
    showMessage('')
    this.sdk.stopAcquisition().then(function() {
      _instance.acquisitionStarted = false


    }, function(error) {
      showMessage(error.message)
    })
  }

  FingerprintSdkTest.prototype.getInfo = function() {
    var _instance = this
    return this.sdk.enumerateDevices()
  }

  FingerprintSdkTest.prototype.getDeviceInfoWithID = function(uid) {
    var _instance = this
    return this.sdk.getDeviceInfo(uid)
  }


  return FingerprintSdkTest
})()

function showMessage(message) {

  $('#message').innerHTML = message
}

window.onload = function() {
  //************* please check this with your coditions  ***************/ 
  
  // localStorage.clear()

  localStorage.removeItem('imageSrc')
  localStorage.removeItem('image')
  localStorage.removeItem('wsq')
  localStorage.removeItem('raw')
  localStorage.removeItem('intermediate')

  test = new FingerprintSdkTest()
}
var curId = ''

function onStart(event) {
   
  event.preventDefault()
  curId = event.target.id
  console.log()
  console.log(event.target.value)


  if (event.target.value == '1') {
    check = '1'
  } else if (event.target.value == '2') {
    check = '2'
  } else if (event.target.value == '3') {
    check = '3'
  } else if (event.target.value == '4') {
    check = '4'
  }
  changeButtonText(true)
  if (currentFormat == '') {
    alert('Please select a format.')
  } else {
    test.startCapture(event.target.val)
  }
}

function changeButtonText(bool) {
  if (bool) {
    $('#starScanning').html('Stop Scann')
    $('#starScanning').click(function() {
      onStop()
    })
  } else {
    $('#starScanning').html('Start Scan')
    $('#starScanning').click(function(event) {
      onStart(event)
    })
  }

}

function onStop() {
  changeButtonText(false)

  test.stopCapture()
}

function onGetInfo() {
  var allReaders = test.getInfo()
  allReaders.then(function(sucessObj) {
    populateReaders(sucessObj)
  }, function(error) {
    showMessage(error.message)
  })
}

function onDeviceInfo(id, element) {
  var myDeviceVal = test.getDeviceInfoWithID(id)
  myDeviceVal.then(function(sucessObj) {
    var deviceId = sucessObj.DeviceID
    var uidTyp = deviceUidType[sucessObj.eUidType]
    var modality = deviceModality[sucessObj.eDeviceModality]
    var deviceTech = deviceTechn[sucessObj.eDeviceTech]

    var retutnVal = //"Device Info -"
      'Id : ' + deviceId
      + '<br> Uid Type : ' + uidTyp
      + '<br> Device Tech : ' + deviceTech
      + '<br> Device Modality : ' + modality

    document.getElementById(element).innerHTML = retutnVal

  }, function(error) {
    showMessage(error.message)
  })

}

function onClear() {
  var vDiv = document.getElementById('imagediv')
  vDiv.innerHTML = ''
  localStorage.setItem('imageSrc', '')
  localStorage.setItem('image', '')

  localStorage.setItem('wsq', '')
  localStorage.setItem('raw', '')
  localStorage.setItem('intermediate', '')

}


$('#save').on('click', function() {
  if (localStorage.getItem('imageSrc') == '' || localStorage.getItem('imageSrc') == null || document.getElementById('imagediv').innerHTML == '') {
    alert('Error -> Fingerprint not available')
  } else {
    var vDiv = document.getElementById('imageGallery')
    if (vDiv.children.length < 5) {
      var image = document.createElement('img')
      image.id = 'galleryImage'
      image.className = 'img-thumbnail'
      image.src = localStorage.getItem('imageSrc')
      vDiv.appendChild(image)

      localStorage.setItem('imageSrc' + vDiv.children.length, localStorage.getItem('imageSrc'))
    } else {
      document.getElementById('imageGallery').innerHTML = ''
      $('#save').click()
    }
  }
})


function sampleAcquired(s) {
   ;
  localStorage.setItem('imageSrc', '')
  var samples = JSON.parse(s.samples)

  localStorage.setItem('imageSrc', 'data:image/png;base64,' + Fingerprint.b64UrlTo64(samples[0]))
  localStorage.setItem('image', Fingerprint.b64UrlTo64(samples[0]))

  if (curId != null) {
     ;
    var patientimage = document.getElementById(curId)
    patientimage.src = localStorage.getItem('imageSrc')
    // console.log(curId + 'Hidden')
    document.getElementById(curId + 'Hidden').value = localStorage.getItem('image')

    onStop()

    // var fingerPrint = localStorage.getItem('image')
    // console.log('-----------------------------------------',fingerPrint);


  }

}
