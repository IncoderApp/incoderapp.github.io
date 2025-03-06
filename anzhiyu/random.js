var posts=["2022/06/01/lawrefbook/","2022/07/01/lawrefbook1/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };