// bootstrap (io);

var fileInUrl = getUrlParamByName('url');

$(function(){                                 
  updateFileTypeSelect();
  submitInOneTouch();
});                                 

var selectedKeys = {}, select_ = {}, selectors = [];

if (fileInUrl) {
  $('#jsonloader')
    .find('input[value=text]').prop('checked', true).end()
    .find('.json-url input').val(fileInUrl).end();
  $('#jsonloader').trigger('submit');
};

$('ul.tabs-caption').on('click', 'li:not(.active)', function() {
  $(this).addClass('active').siblings().removeClass('active').closest('div.status-container')
  .find('div.tabs-content').removeClass('active').eq($(this).index()).addClass('active');
});


/////////////////////////////////////////////////////////////////////////////////////////////

function updateFileTypeSelect() {
  var val = $('#jsonloader input:checked[name=optradio]').val();

  var controls = {
    'text': $('.show-if-json-http').hide(),
    'file': $('.show-if-json-file').hide()
  };


  controls[val].show();
}


function submitInOneTouch () {
  $('#jsonloader input[type=radio]').on('change', updateFileTypeSelect);
  $('#jsonloader :file').on('change', function() { $('#jsonloader').submit(); });
}

$('#jsonloader').submit(function (evt) {
  evt.preventDefault();
  clearFeedback();

  var localOrRemote = $('#jsonloader').find('.form-check-inline').find('input:checked').val();

  if (localOrRemote === 'text') {  // if remote JSON
    var jsonPromise = $.getJSON($(this).find('.url').val())
      .then(jsonLoadSuccessHandler, jsonLoadErrorHandler(localOrRemote));

  } else {  // if local JSON
    var reader = new FileReader();

    reader.addEventListener('load', function() {
      var json = safelyParseJSON(this.result);


      if (json) {
        $('#filename').removeClass('hidden').html(json.name);
        jsonLoadSuccessHandler(json);
      }
    });

    var fileObj = $('#jsonloader :file')[0].files[0];
    $('#jsonloader :file').val('');
    
    if (fileObj) {
      reader.readAsText(fileObj);
    } else {
      jsonLoadErrorHandler(localOrRemote);
    }
  }
});

function jsonLoadSuccessHandler(elem) {  
  clearSocketLog();
  elem = object_(elem);
  if (elem.wsagger === 'variants') {
    showVariants(elem);
  
  } else if (elem.wsagger === 'index') {
    showTree(elem);

  } else {
    showScenario(elem);

  }
}


function jsonLoadErrorHandler(error) {
  var message =  (error === "text")? 'Incorrect URL' : 'File not selected';
  $('#jsonloader').find('.feedback').addClass('error').html(message);
}

function clearFeedback(){
  $('#jsonloader').find('.feedback').html("").fadeIn(); // clear JSON message
}

function announce(evtName, domEl){
  var domEl = domEl || $('body');
  domEl.trigger(evtName);
}


function getUrlParamByName(name, url) {
  if (!url) {
    url = window.location.href;
  }

  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return '';

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function safelyParseJSON (json) {
  var parsed;

  try {
    parsed = jsonlint.parse(json);
    $('.error-message').remove();
  } catch (e) {
    console.error('Error:', e.message);
    $('.show-if-json-file').after($('<div>').text (e.message).css('color', 'red').css('clear', 'both').addClass('error-message'));  // show error info
    $('#data').html('');
    $('select').remove();
  }

  return parsed;
}

function log () {
  console.log.apply(console, Array.prototype.slice.apply(arguments));
}


function error () {
  console.log.apply(console, Array.prototype.slice.apply(arguments));
}


function copia (data) {
   if (data instanceof Array) {
      return data.map((e) => {return copia(e); });

   } else if (data && (typeof data === 'object')) {
      var data_ = {}; for (var i in data) data_[i] = copia(data[i]);
      return data_;

   }
   return data;
}


function object_ (A) {
  return (A === null || A === undefined) ? {} : (typeof A !== 'object') ? { } : (A instanceof Array) ? {} :  A ;
}

function array_ (A) {
  return (A === null || A === undefined) ? [] : (typeof A !== 'object') ? [A] : (A instanceof Array) ? A  : [A];
}

function string_ (data) {
  return ((typeof data === 'object') && data) ? JSON.stringify(data) : data;
}

