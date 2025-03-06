document.addEventListener('DOMContentLoaded', function () {
    const htmlElement = document.documentElement;
  
    // 监听 data-theme 属性的变化
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === 'data-theme') {
          // 获取当前 data-theme 的值
          const currentTheme = htmlElement.getAttribute('data-theme');
  
          // 根据 data-theme 设置图标样式
          if (currentTheme === 'dark') {
            // 设置显示 b 图标的样式或执行其他操作
            document.getElementsByClassName('footer_mini_logo').src = 'https://res.cloudinary.com/incoder/image/upload/v1624336752/incoderapp/architecture_white_48dp.svg';
          } else {
            // 设置显示 a 图标的样式或执行其他操作
            document.getElementsByClassName('footer_mini_logo').src = 'https://res.cloudinary.com/incoder/image/upload/v1706342209/incoderapp/incoderapp.svg';
          }
        }
      });
    });
  
    // 配置观察的目标和观察的属性
    observer.observe(htmlElement, {
      attributes: true,
    });
  });