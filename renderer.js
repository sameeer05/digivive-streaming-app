const XLSX = require('xlsx');

$(document).ready(function() {
  let streamCount = 0;

  // Handle Next button click
  $('#initialForm').on('submit', function(event) {
    event.preventDefault();
    streamCount = $('#streamCount').val();
    if (streamCount > 0 && streamCount <= 50) {
      generateFormFields(streamCount);
      $('#initialContainer').addClass('hidden');
      $('#formContainer').removeClass('hidden');
    } else {
      alert('Please enter a number between 1 and 50.');
    }
  });

  // Handle Excel file upload
  $('#excelFile').on('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      console.log('file received');
      const reader = new FileReader();
      reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        streamCount = jsonData.length;
        generateFormFieldsFromExcel(jsonData);
        $('#initialContainer').addClass('hidden');
        $('#formContainer').removeClass('hidden');
      };
      reader.readAsArrayBuffer(file);
    }
  });

  // Generate the form fields dynamically
  function generateFormFields(count) {
    $('#formFields').empty();
    $('#streams').empty();
    for (let i = 1; i <= count; i++) {
      $('#formFields').append(`
        <div class="row mb-3">
          <div class="col-1 d-flex align-items-center">
            <span class="">Stream&nbsp${i}:</span>
          </div>
          <div class="col-3">
            <input type="text" id="stream${i}Name" name="stream${i}Name" placeholder="Name" value="Stream ${i}" required class="form-control">
          </div>
          <div class="col-8">
            <input type="text" id="stream${i}" name="stream${i}" placeholder="URL" value="https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8" required class="form-control">
          </div>
        </div>
      `);

      $('#streams').append(`
        <div class="stream-container" id="stream${i}Container">
          <h3 id="stream${i}Title">Stream ${i}</h3>
          <video id="video${i}" class="video-js vjs-default-skin" controls preload="auto" width="300px" height="200px" muted></video>
        </div>
      `);
    }
  }

  // Generate the form fields from Excel data
  function generateFormFieldsFromExcel(data) {
    $('#formFields').empty();
    $('#streams').empty();
    data.forEach((stream, index) => {
      const i = index + 1;
      $('#formFields').append(`
        <div class="row mb-3">
          <div class="col-1 d-flex align-items-center">
            <span class="">Stream&nbsp${i}:</span>
          </div>
          <div class="col-3">
            <input type="text" id="stream${i}Name" name="stream${i}Name" placeholder="Name" value="${stream.name}" required class="form-control">
          </div>
          <div class="col-8">
            <input type="text" id="stream${i}" name="stream${i}" placeholder="URL" value="${stream.url}" required class="form-control">
          </div>
        </div>
      `);

      $('#streams').append(`
        <div class="stream-container" id="stream${i}Container">
          <h3 id="stream${i}Title">${stream.name}</h3>
          <video id="video${i}" class="video-js vjs-default-skin" controls preload="auto" width="300px" height="200px" muted></video>
        </div>
      `);
    });
  }

  // Handle form submission
  $('#streamForm').on('submit', function(event) {
    event.preventDefault();

    for (let i = 1; i <= streamCount; i++) {
      const streamName = $(`#stream${i}Name`).val();
      const streamUrl = $(`#stream${i}`).val();

      $(`#stream${i}Title`).text(streamName);

      const player = videojs($(`#video${i}`)[0], {
        controls: true,
        muted: true,
        controlBar: {
          children: ['muteToggle', ] //'volumePanel'
        }
      });

      player.src({ type: 'application/x-mpegURL', src: streamUrl });
      player.play();
    }

    $('#formContainer').addClass('hidden');
    $('#streamsContainer').removeClass('hidden');
  });

  // Handle back button click in streamsContainer
  $('#backButton').on('click', function() {
    $('#formContainer').removeClass('hidden');
    $('#streamsContainer').addClass('hidden');

    for (let i = 1; i <= streamCount; i++) {
      const player = videojs($(`#video${i}`)[0]);
      player.pause();
    }
  });

  // Handle back button click in formContainer
  $('#formBackButton').on('click', function() {
    $('#initialContainer').removeClass('hidden');
    $('#formContainer').addClass('hidden');
  });
});
