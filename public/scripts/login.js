'use strict';

var userInfo = {
  OAuth: '',
  currentUser: '',
  userID: ''
};

// $('.twitch-connect').click(function () {
//   window.location = 'https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id=pxic46d4dsydwhxvlh341kb7dgdnc6&redirect_uri=https://bittoolscod301.herokuapp.com&scope=user_read+channel_read';
// });

function checkLogin() {
  if (localStorage.userInfo) {
    $('#login').hide();
    $('#widgets').show();
    $('#navBlock').show();
    var savedInfo = JSON.parse(localStorage.getItem('userInfo'));
    userInfo.OAuth = savedInfo.OAuth;
    userInfo.currentUser = savedInfo.currentUser;
    userInfo.userID = savedInfo.userID;
    renderWidget();
  } else {
    var clientID;
    var clientSecret;
    $('#widgets').hide();
    $('#navBlock').hide();
    $('#login').show();
    var newValue = document.location.href.split('=')[1].split('&')[0];
    $.get('/config-vars', function (data) {
      console.log(data);
      clientID = data[0];
      clientSecret = data[1];
    }).then(
    $.ajax({
      url: "https://api.twitch.tv/kraken/oauth2/token",
      method: "POST",
      data: {
        client_id: clientID,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: 'https://bittoolscod301.herokuapp.com',
        code: newValue
      },
      success: function(data) {
        userInfo.OAuth = data.access_token;
        $.ajax({
          url: 'https://api.twitch.tv/kraken',
          headers: {
            Accept: "application/vnd.twitchtv.v5+json",
            Authorization: `OAuth ${data.access_token}`,
            "Client-ID": clientID
          },
          success: function(data){
            userInfo.currentUser = data.token.user_name;
            userInfo.userID = data.token.user_id;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            $('#login').hide();
            $('#widgets').show();
            $('#navBlock').show();
            renderWidget();
          }
        })
      }
    });
    );
  }
}
