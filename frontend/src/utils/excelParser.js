import * as XLSX from 'xlsx';

/**
 * 解析会员名单Excel
 * @param {File} file - Excel文件
 * @returns {Promise<Array>} 会员数组
 */
export function parseMemberExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const members = [];
        for (const row of jsonData) {
          const userId = row['用户ID'];
          const nickname = row['用户昵称'];

          if (userId && nickname) {
            members.push({
              userId: String(userId).trim(),
              nickname: String(nickname).trim()
            });
          }
        }

        resolve(members);
      } catch (error) {
        reject(new Error('Excel解析失败: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * 解析观看名单Excel
 * @param {File} file - Excel文件
 * @returns {Promise<Array>} 用户ID数组
 */
export function parseViewRecordExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const userIds = [];
        for (const row of jsonData) {
          const userId = row['用户ID'];
          if (userId) {
            userIds.push(String(userId).trim());
          }
        }

        resolve(userIds);
      } catch (error) {
        reject(new Error('Excel解析失败: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsArrayBuffer(file);
  });
}
