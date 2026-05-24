const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    this.memoryCache = new Map();
    this.cacheDir = config.cache.cacheDir;
    this.ensureCacheDir();
  }

  ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
      logger.info('缓存目录已创建');
    }
  }

  // 内存缓存
  getFromMemory(key) {
    const cached = this.memoryCache.get(key);
    if (cached && Date.now() < cached.expireAt) {
      logger.debug(`内存缓存命中: ${key}`);
      return cached.data;
    }
    return null;
  }

  setToMemory(key, data, ttl = config.cache.memoryTTL) {
    this.memoryCache.set(key, {
      data,
      expireAt: Date.now() + ttl
    });
    logger.debug(`内存缓存已写入: ${key}`);
  }

  // 文件缓存
  getFilePath(key) {
    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
    return path.join(this.cacheDir, `${safeKey}.json`);
  }

  getFromFile(key) {
    try {
      const filePath = this.getFilePath(key);
      if (!fs.existsSync(filePath)) return null;

      const content = fs.readFileSync(filePath, 'utf8');
      const cached = JSON.parse(content);

      if (Date.now() < cached.expireAt) {
        logger.debug(`文件缓存命中: ${key}`);
        this.setToMemory(key, cached.data); // 同步到内存
        return cached.data;
      }
      return null;
    } catch (err) {
      logger.error(`读取文件缓存失败: ${err.message}`);
      return null;
    }
  }

  setToFile(key, data, ttl = config.cache.fileTTL) {
    try {
      const filePath = this.getFilePath(key);
      fs.writeFileSync(filePath, JSON.stringify({
        data,
        expireAt: Date.now() + ttl
      }, null, 2));
      logger.debug(`文件缓存已写入: ${key}`);
    } catch (err) {
      logger.error(`写入文件缓存失败: ${err.message}`);
    }
  }

  // 公共接口
  get(key) {
    return this.getFromMemory(key) || this.getFromFile(key);
  }

  set(key, data, options = {}) {
    const memoryTTL = options.memoryTTL || config.cache.memoryTTL;
    const fileTTL = options.fileTTL || config.cache.fileTTL;

    this.setToMemory(key, data, memoryTTL);
    this.setToFile(key, data, fileTTL);
  }
}

module.exports = new CacheService();
