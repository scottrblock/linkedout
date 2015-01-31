$(document).ready(function(){
  $('#get-started').click(function(){
    $('#loading').show();
    OAuth.initialize('2l4h7r-XUVb_LzikYcp1_KMgD_Y');
    OAuth.popup('twitter').done(function(result) {

        result.me().done(function(data) {
            var id = data.id;
            var url = "https://api.twitter.com/1.1/friends/list.json?count=200&user_id=" + id;
            get_users(result, url, -1, []);

        })
    }).fail(function (error){
      show_error(error);
    });

    return false;
  });
  
});

var get_users = function(result, url, next_cursor, users){
  if (next_cursor !== 0){
    var full_url = url + "&cursor=" + next_cursor;
    result.get(full_url).done(function(followers){
      users.push(followers.users);
      get_users(result, url, followers.next_cursor, users);
    }).fail(function (error) {
      show_error(error);
    });
  } else {
    get_users_callback(users);
  }

};

var get_users_callback = function(users){
  var users = _.flatten(users); 
  var $result_container = $('#results');

  $.each(users, function(i, user){
    if (user.entities.url !== null && user.entities.url !== undefined && user.entities.url.urls.length > 0){
      if( user.entities.url.urls[0].expanded_url !== null && 
          user.entities.url.urls[0].expanded_url.indexOf("linkedin") > -1){
          console.log(user);
          var result_str = "<li><strong>" + user.name + "</strong> <em>(<a target='_blank' href='http://twitter.com/" + user.screen_name + "'>@" + user.screen_name + "</a>)</em> ";
              result_str += "listed <a target='_blank' href='" + user.entities.url.urls[0].expanded_url + "'>" + user.entities.url.urls[0].expanded_url + "</a></li>";
          $result_container.append(result_str);
      }
    }
    
  });

  $('#loading').hide();

};

var show_error = function(error){
  console.log(error);
  var $error = $('#error .alert');
  $error.append("<p><small>Error " + error.status + ": " + error.statusText + "</small></p><p><small>" + "If you're experiencing any issues, the site has probably reached its Twitter API rate limit, in which case you can try again in a few minutes.</small></p>");
  $error.show();

  $('#loading').hide();
}