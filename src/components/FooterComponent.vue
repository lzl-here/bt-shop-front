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
        <ul>
          <li><a href="#">扫码关注公众号</a></li>
        </ul>
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
  margin-top: 40px;
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
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section ul li a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: var(--el-color-primary);
}

.footer-bottom {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.footer-bottom p {
  color: #999;
  font-size: 14px;
}

@media screen and (max-width: 768px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media screen and (max-width: 480px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style> 