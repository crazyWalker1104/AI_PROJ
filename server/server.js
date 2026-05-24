const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const logger = require('./utils/logger');
const apiLimiter = require('./utils/limiter');

const fundRouter = require('./routes/fund');
const sentimentRouter = require('./routes/sentiment');
const etfRouter = require('./routes/etf');
const dragonRouter = require('./routes/dragon');

const app = express();

app.use(cors());
app.use(express.json());
app.use(apiLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), tushareEnabled: config.tushare.enabled });
});

app.use('/api/fund', fundRouter);
app.use('/api/sentiment', sentimentRouter);
app.use('/api/etf', etfRouter);
app.use('/api/dragon', dragonRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: '接口不存在' });
});

const PORT = config.server.port;
app.listen(PORT, () => {
  logger.success(`服务已启动，端口: ${PORT}`);
  logger.info(`健康检查: http://localhost:${PORT}/health`);
  if (config.tushare.enabled) {
    logger.success('tushare API已启用');
  } else {
    logger.warn('tushare API未配置，使用Mock数据');
  }
});
