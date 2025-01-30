<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>关于我们</h3>
        <ul>
          <li><a href="#">公司简介</a></li>
          <li><a href="#">联系我们</a></li>
          <li><a href="#">加入我们</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>帮助中心</h3>
        <ul>
          <li><a href="#">购物指南</a></li>
          <li><a href="#">支付方式</a></li>
          <li><a href="#">配送方式</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>售后服务</h3>
        <ul>
          <li><a href="#">退换货政策</a></li>
          <li><a href="#">退换货流程</a></li>
          <li><a href="#">常见问题</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>关注我们</h3>
        <div class="qrcode">
          <p>扫码关注公众号</p>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2024 BT-Shop All Rights Reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #fff;
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 0 20px;
}

.footer-section h3 {
  margin-bottom: 20px;
  font-size: 18px;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section ul li a {
  color: #666;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: var(--primary-color);
}

.qrcode {
  text-align: center;
}

.qrcode img {
  width: 120px;
  height: 120px;
  margin-bottom: 10px;
}

.qrcode p {
  color: #666;
  font-size: 14px;
}

.footer-bottom {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  color: #999;
}
</style> 