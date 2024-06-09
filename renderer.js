$(document).ready(function() {
  const streamCount = 20;

  // Generate the form fields dynamically
  for (let i = 1; i <= streamCount; i++) {
    $('#formFields').append(`
      <div class="row">
        <div class="col-1 d-flex align-items-center">
          <span class="">Stream&nbsp${i}:</span>
        </div>
        <div class="col-3">
          <!-- <label for="stream${i}Name">Name:</label> -->
          <input type="text" id="stream${i}Name" name="stream${i}Name" placeholder="Name" value="Stream ${i}" required>
        </div>
        <div class="col-8">
          <!-- <label for="stream${i}">URL:</label> -->
          <input type="text" id="stream${i}" name="stream${i}" placeholder="URL" value="https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8" required>
        </div>
        <br/>
      </div>
    `);

    $('#streams').append(`
      <div class="stream-container" id="stream${i}Container">
        <h3 id="stream${i}Title">Stream ${i}</h3>
        <video id="video${i}" class="video-js vjs-default-skin" controls preload="auto" width="300px" height="200px" muted></video>
      </div>
    `);
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
          children: ['muteToggle', ] // 'volumePanel'
        }
      });

      player.src({ type: 'application/x-mpegURL', src: streamUrl });
      player.play();
    }

    $('#formContainer').addClass('hidden');
    $('#streamsContainer').removeClass('hidden');
  });

  // Handle back button click
  $('#backButton').on('click', function() {
    $('#formContainer').removeClass('hidden');
    $('#streamsContainer').addClass('hidden');

    for (let i = 1; i <= streamCount; i++) {
      const player = videojs($(`#video${i}`)[0]);
      player.pause();
    }
  });
});
