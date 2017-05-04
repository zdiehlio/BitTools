'use strict';

var toRender;

function drawUserPage() {
  $.get(`/choices/${dynamicUser}`, function (data) {
    $('#show-choices').remove();
    toRender = data;
    linkFont(toRender[0].google_font);
    var renderHeader = Handlebars.compile($('#widget-text-template').html());
    var renderChoice = Handlebars.compile($('#user-template').html());
    var theForm = renderHeader({widgetText: toRender[0].widget_text, textColor: toRender[0].text_color});
    $('body').prepend(theForm);

    for (var a = 0; a < toRender.length; a++) {
      var oneChoice = {};
      oneChoice.fillColor = toRender[a].fill_color;
      oneChoice.textColor = toRender[a].text_color;
      oneChoice.choiceColor = toRender[a].choice_color;
      oneChoice.choiceText = toRender[a].choice_text;
      oneChoice.value = parseInt(toRender[a].goal) >= 100 ? Math.ceil(parseInt(toRender[a].value) / parseInt(toRender[a].goal) * 100) : Math.ceil(parseInt(toRender[a].value));
      $('#show-choices').append(renderChoice(oneChoice));
      console.log(oneChoice);
    }
  });
}

twitchClient.on('cheer', function (channel, userstate, message) {
  for (var i = 0; i < toRender.length; i++) {
    if (message.includes(toRender[i].choice_text)) {
      var newVal = parseInt(toRender[i].value) + parseInt(userstate.bits);
      console.log(newVal);
      $.ajax({
        url: `/choices/${dynamicUser}`,
        method: 'PUT',
        data: {
          value: newVal,
          choiceText: toRender[i].choice_text
        }
      })
      .then(drawUserPage);
      break;
    }
  }
});

function linkFont (userfont) {
  var linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  userfont = userfont.replace(/\s+/g, '+');
  console.log(userfont);
  linkElement.href = `https://fonts.googleapis.com/css?family=${userfont}`;
  console.log(linkElement.href);
  document.head.appendChild(linkElement);
  $('body').css(`font-family: '${userfont}', sans-serif`);
};