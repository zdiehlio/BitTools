var dynamicUser = document.location.href.split('=')[1];

var options = {
  options:{
    debug: true
  },
  connection: {
    cluster: 'aws',
    reconnect: true,
    secure: true
  },
  // identity: {
  //   username: userInfo.currentUser,
  //   password: `oauth:${userInfo.OAuth}`
  // },
  channels: ['swift_sh0t']
  // channels: [dynamicUser]
};

var twitchClient = new tmi.client(options);
twitchClient.connect();
