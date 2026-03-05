const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const db = require('../database');
const { parseMemberExcel } = require('../services/excelService');

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'members-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/**
 * 导入会员名单
 * POST /api/members/import
 */
router.post('/import', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传文件' });
    }

    // 解析Excel
    const members = parseMemberExcel(req.file.path);

    if (members.length === 0) {
      return res.status(400).json({ error: 'Excel中没有找到有效的会员数据' });
    }

    // 清空旧数据并插入新数据
    db.run('DELETE FROM members', (err) => {
      if (err) {
        return res.status(500).json({ error: '清空旧数据失败: ' + err.message });
      }

      // 批量插入新数据
      const insertStmt = db.prepare('INSERT INTO members (user_id, nickname) VALUES (?, ?)');

      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        members.forEach((member) => {
          insertStmt.run(member.user_id, member.nickname);
        });

        db.run('COMMIT', () => {
          // 删除上传的文件
          fs.unlinkSync(req.file.path);

          res.json({
            success: true,
            message: '会员名单导入成功',
            count: members.length
          });
        });
      });
    });

  } catch (error) {
    // 删除上传的文件
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * 获取会员统计信息
 * GET /api/members/stats
 */
router.get('/stats', (req, res) => {
  db.get('SELECT COUNT(*) as count FROM members', (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      totalMembers: row.count
    });
  });
});

/**
 * 获取所有会员列表
 * GET /api/members
 */
router.get('/', (req, res) => {
  db.all('SELECT user_id, nickname, created_at FROM members ORDER BY user_id', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

module.exports = router;
