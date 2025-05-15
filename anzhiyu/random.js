var posts=["android/lawrefbook-story/","android/lawrefbook/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };