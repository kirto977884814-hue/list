const xlsx = require('xlsx');

/**
 * 解析会员名单Excel
 * @param {string} filePath - Excel文件路径
 * @returns {Array} 会员数组 [{user_id, nickname}, ...]
 */
function parseMemberExcel(filePath) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // 验证必需的列
    const members = [];
    for (const row of data) {
      const userId = row['用户ID'];
      const nickname = row['用户昵称'];

      if (userId && nickname) {
        members.push({
          user_id: String(userId).trim(),
          nickname: String(nickname).trim()
        });
      }
    }

    return members;
  } catch (error) {
    throw new Error('Excel解析失败: ' + error.message);
  }
}

/**
 * 解析观看名单Excel
 * @param {string} filePath - Excel文件路径
 * @returns {Array} 用户ID数组
 */
function parseViewRecordExcel(filePath) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // 提取用户ID
    const userIds = [];
    for (const row of data) {
      const userId = row['用户ID'];
      if (userId) {
        userIds.push(String(userId).trim());
      }
    }

    return userIds;
  } catch (error) {
    throw new Error('Excel解析失败: ' + error.message);
  }
}

module.exports = {
  parseMemberExcel,
  parseViewRecordExcel
};
