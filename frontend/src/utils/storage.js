/**
 * 本地存储工具
 * 使用localStorage存储会员数据
 */

const MEMBERS_KEY = 'live_view_members';
const MEMBERS_BACKUP_KEY = 'live_view_members_backup';

/**
 * 保存会员名单到本地存储
 * @param {Array} members - 会员数组
 */
export function saveMembers(members) {
  try {
    // 备份旧数据
    const oldData = localStorage.getItem(MEMBERS_KEY);
    if (oldData) {
      localStorage.setItem(MEMBERS_BACKUP_KEY, oldData);
    }

    // 保存新数据
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    localStorage.setItem(MEMBERS_KEY + '_time', new Date().toISOString());
    return true;
  } catch (error) {
    console.error('保存会员数据失败:', error);
    return false;
  }
}

/**
 * 从本地存储获取会员名单
 * @returns {Array} 会员数组
 */
export function getMembers() {
  try {
    const data = localStorage.getItem(MEMBERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('读取会员数据失败:', error);
    return [];
  }
}

/**
 * 获取会员统计信息
 * @returns {Object} 统计信息
 */
export function getMemberStats() {
  const members = getMembers();
  return {
    totalMembers: members.length,
    lastUpdated: localStorage.getItem(MEMBERS_KEY + '_time')
  };
}

/**
 * 清除会员数据
 */
export function clearMembers() {
  localStorage.removeItem(MEMBERS_KEY);
  localStorage.removeItem(MEMBERS_KEY + '_time');
}

/**
 * 对比会员名单和观看名单
 * @param {Array} members - 会员数组
 * @param {Array} viewedUserIds - 观看的用户ID数组
 * @returns {Object} 对比结果
 */
export function compareMembers(members, viewedUserIds) {
  const viewedSet = new Set(viewedUserIds);
  const missedMembers = members.filter(m => !viewedSet.has(m.userId));

  return {
    totalMembers: members.length,
    viewedCount: viewedUserIds.length,
    missedCount: missedMembers.length,
    missedMembers: missedMembers
  };
}
