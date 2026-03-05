const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const db = require('../database');
const { parseViewRecordExcel } = require('../services/excelService');

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
    cb(null, 'view-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/**
 * 导入观看名单并对比
 * POST /api/view-records/import
 */
router.post('/import', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传文件' });
    }

    // 解析观看名单Excel
    const viewedUserIds = parseViewRecordExcel(req.file.path);

    if (viewedUserIds.length === 0) {
      return res.status(400).json({ error: 'Excel中没有找到有效的观看数据' });
    }

    // 获取总会员数
    db.get('SELECT COUNT(*) as total FROM members', (err, row) => {
      if (err) {
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ error: err.message });
      }

      const totalMembers = row.total;

      // 创建观看记录
      const recordName = req.body.recordName || `观看记录_${new Date().toLocaleString('zh-CN')}`;
      const viewedCount = viewedUserIds.length;
      const missedCount = totalMembers - viewedCount;

      db.run(
        'INSERT INTO view_records (record_name, total_members, viewed_count, missed_count) VALUES (?, ?, ?, ?)',
        [recordName, totalMembers, viewedCount, missedCount],
        function(err) {
          if (err) {
            fs.unlinkSync(req.file.path);
            return res.status(500).json({ error: err.message });
          }

          const recordId = this.lastID;

          // 插入观看详情
          const insertStmt = db.prepare('INSERT INTO view_details (record_id, user_id) VALUES (?, ?)');

          db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            viewedUserIds.forEach((userId) => {
              insertStmt.run(recordId, userId);
            });

            db.run('COMMIT', () => {
              // 删除上传的文件
              fs.unlinkSync(req.file.path);

              res.json({
                success: true,
                message: '观看名单导入成功',
                recordId: recordId,
                stats: {
                  totalMembers,
                  viewedCount,
                  missedCount
                }
              });
            });
          });
        }
      );
    });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * 获取未观看会员列表
 * GET /api/view-records/:id/result
 */
router.get('/:id/result', (req, res) => {
  const recordId = req.params.id;

  // 获取观看记录信息
  db.get('SELECT * FROM view_records WHERE id = ?', [recordId], (err, record) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!record) {
      return res.status(404).json({ error: '观看记录不存在' });
    }

    // 获取该记录的观看用户ID列表
    db.all('SELECT user_id FROM view_details WHERE record_id = ?', [recordId], (err, viewedRows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const viewedUserIds = new Set(viewedRows.map(row => row.user_id));

      // 获取所有会员，过滤出未观看的
      db.all('SELECT user_id, nickname FROM members ORDER BY user_id', (err, allMembers) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        const missedMembers = allMembers.filter(member => !viewedUserIds.has(member.user_id));

        res.json({
          record: {
            id: record.id,
            recordName: record.record_name,
            importTime: record.import_time,
            totalMembers: record.total_members,
            viewedCount: record.viewed_count,
            missedCount: record.missed_count
          },
          missedMembers: missedMembers
        });
      });
    });
  });
});

/**
 * 获取观看记录列表
 * GET /api/view-records
 */
router.get('/', (req, res) => {
  db.all('SELECT * FROM view_records ORDER BY import_time DESC LIMIT 50', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

/**
 * 获取单个观看记录详情
 * GET /api/view-records/:id
 */
router.get('/:id', (req, res) => {
  const recordId = req.params.id;

  db.get('SELECT * FROM view_records WHERE id = ?', [recordId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: '观看记录不存在' });
    }

    res.json(row);
  });
});

module.exports = router;
